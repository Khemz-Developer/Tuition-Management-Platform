import { useState, useMemo, ReactNode } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Checkbox } from './checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Grid3x3, List, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => ReactNode
  sortable?: boolean
  sortFn?: (a: T, b: T) => number
  pinable?: boolean
  defaultPinned?: 'left' | 'right'
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchKey?: string | string[]
  searchPlaceholder?: string
  onRowClick?: (row: T) => void
  renderRowActions?: (row: T) => ReactNode
  renderGridItem?: (row: T) => ReactNode
  isLoading?: boolean
  emptyMessage?: string
  pageSize?: number
  showViewToggle?: boolean
  defaultView?: 'list' | 'grid'
}

type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
}

type PinnedColumn = {
  id: string
  side: 'left' | 'right'
}

export function DataTable<T extends { id?: string; _id?: string }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Search...',
  onRowClick,
  renderRowActions,
  renderGridItem,
  isLoading = false,
  emptyMessage = 'No data found',
  pageSize = 5,
  showViewToggle = true,
  defaultView = 'list',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [pinnedColumns, setPinnedColumns] = useState<PinnedColumn[]>(() => {
    return columns
      .filter((col) => col.defaultPinned)
      .map((col) => ({ id: col.id, side: col.defaultPinned! }))
  })
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns.map((col) => col.id)
  )
  // Removed selectedRows state for checkbox selection
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(defaultView)
  const [rowsPerPage, setRowsPerPage] = useState(pageSize)

  // Get row ID
  const getRowId = (row: T): string => {
    return (row.id || row._id || String(Math.random())) as string
  }

  // Filter data
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data

    const query = searchQuery.toLowerCase()
    const searchKeys = Array.isArray(searchKey) ? searchKey : [searchKey]
    
    return data.filter((row) => {
      return searchKeys.some((key) => {
        const value = (row[key as keyof T] as string)?.toLowerCase() || ''
        return value.includes(query)
      })
    })
  }, [data, searchQuery, searchKey])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.id === sortConfig.key)
      if (!column) return 0

      // Use custom sort function if provided
      if (column.sortFn) {
        const result = column.sortFn(a, b)
        return sortConfig.direction === 'asc' ? result : -result
      }

      // Fall back to accessorKey if available
      if (!column.accessorKey) return 0

      const aValue = a[column.accessorKey]
      const bValue = b[column.accessorKey]

      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1

      const comparison =
        typeof aValue === 'string'
          ? aValue.localeCompare(String(bValue))
          : Number(aValue) - Number(bValue)

      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortConfig, columns])

  // Organize columns by pinned state
  const organizedColumns = useMemo(() => {
    const leftPinned = pinnedColumns
      .filter((p) => p.side === 'left')
      .map((p) => columns.find((col) => col.id === p.id))
      .filter(Boolean) as Column<T>[]

    const rightPinned = pinnedColumns
      .filter((p) => p.side === 'right')
      .map((p) => columns.find((col) => col.id === p.id))
      .filter(Boolean) as Column<T>[]

    const unpinnedIds = columnOrder.filter(
      (id) => !pinnedColumns.some((p) => p.id === id)
    )
    const unpinned = unpinnedIds
      .map((id) => columns.find((col) => col.id === id))
      .filter(Boolean) as Column<T>[]

    return { leftPinned, unpinned, rightPinned }
  }, [columns, pinnedColumns, columnOrder])

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, rowsPerPage])

  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const startItem = (currentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(currentPage * rowsPerPage, sortedData.length)

  // Handle sorting
  const handleSort = (columnId: string) => {
    setSortConfig((prev) => {
      if (prev?.key === columnId) {
        if (prev.direction === 'asc') {
          return { key: columnId, direction: 'desc' }
        }
        return null
      }
      return { key: columnId, direction: 'asc' }
    })
  }

  // Handle column pinning
  const handlePinColumn = (columnId: string, side: 'left' | 'right') => {
    setPinnedColumns((prev) => {
      const filtered = prev.filter((p) => p.id !== columnId)
      return [...filtered, { id: columnId, side }]
    })
  }

  const handleUnpinColumn = (columnId: string) => {
    setPinnedColumns((prev) => prev.filter((p) => p.id !== columnId))
  }

  // Handle column reordering
  const handleMoveColumn = (columnId: string, direction: 'left' | 'right') => {
    setColumnOrder((prev) => {
      const index = prev.indexOf(columnId)
      if (index === -1) return prev

      const newIndex = direction === 'left' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newOrder = [...prev]
      ;[newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
      return newOrder
    })
  }

  // Handle row selection
  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }

  const toggleAllSelection = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map(getRowId)))
    }
  }

  // Render column header with dropdown
  const renderColumnHeader = (column: Column<T>) => {
    const isPinnedLeft = pinnedColumns.some((p) => p.id === column.id && p.side === 'left')
    const isPinnedRight = pinnedColumns.some((p) => p.id === column.id && p.side === 'right')
    const isPinned = isPinnedLeft || isPinnedRight
    const currentSort = sortConfig?.key === column.id ? sortConfig.direction : null
    const columnIndex = columnOrder.indexOf(column.id)
    const canMoveLeft = columnIndex > 0
    const canMoveRight = columnIndex < columnOrder.length - 1

    return (
      <TableHead
        className={cn(
          isPinnedLeft && 'sticky left-0 z-10 bg-background',
          isPinnedRight && 'sticky right-0 z-10 bg-background'
        )}
        style={{ width: column.width }}
      >
        <div className="flex items-center gap-2">
          <span>{column.header}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <GripVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {column.sortable !== false && (
                <>
                  <DropdownMenuItem onClick={() => setSortConfig({ key: column.id, direction: 'asc' })}>
                    <ArrowUp className="mr-2 h-4 w-4" /> Asc
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortConfig({ key: column.id, direction: 'desc' })}>
                    <ArrowDown className="mr-2 h-4 w-4" /> Desc
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {column.pinable !== false && (
                <>
                  {!isPinnedLeft && (
                    <DropdownMenuItem onClick={() => handlePinColumn(column.id, 'left')}>
                      ← Pin to left
                    </DropdownMenuItem>
                  )}
                  {!isPinnedRight && (
                    <DropdownMenuItem onClick={() => handlePinColumn(column.id, 'right')}>
                      → Pin to right
                    </DropdownMenuItem>
                  )}
                  {isPinned && (
                    <DropdownMenuItem onClick={() => handleUnpinColumn(column.id)}>
                      Unpin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => handleMoveColumn(column.id, 'left')}
                disabled={!canMoveLeft}
              >
                ← Move to Left
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMoveColumn(column.id, 'right')}
                disabled={!canMoveRight}
              >
                → Move to Right
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {currentSort && (
            <span className="ml-auto">
              {currentSort === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </span>
          )}
        </div>
      </TableHead>
    )
  }

  // Render cell
  const renderCell = (column: Column<T>, row: T) => {
    if (column.cell) {
      return column.cell(row)
    }
    if (column.accessorKey) {
      const value = row[column.accessorKey]
      return <span>{value != null ? String(value) : '-'}</span>
    }
    return null
  }

  if (viewMode === 'grid' && renderGridItem) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            {searchKey && (
              <>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-9"
                />
              </>
            )}
          </div>
          {showViewToggle && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{emptyMessage}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((row) => (
              <div key={getRowId(row)}>{renderGridItem(row)}</div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {startItem} - {endItem} of {sortedData.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page}>...</span>
                }
                return null
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          {searchKey && (
            <>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </>
          )}
        </div>
        {showViewToggle && (
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {organizedColumns.leftPinned.map((column) => renderColumnHeader(column))}
              {organizedColumns.unpinned.map((column) => renderColumnHeader(column))}
              {organizedColumns.rightPinned.map((column) => renderColumnHeader(column))}
              {renderRowActions && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const rowId = getRowId(row)
                return (
                  <TableRow
                    key={rowId}
                    className={cn(
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {organizedColumns.leftPinned.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn('sticky left-0 z-10 bg-background')}
                      >
                        {renderCell(column, row)}
                      </TableCell>
                    ))}
                    {organizedColumns.unpinned.map((column) => (
                      <TableCell key={column.id}>{renderCell(column, row)}</TableCell>
                    ))}
                    {organizedColumns.rightPinned.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn('sticky right-0 z-10 bg-background')}
                      >
                        {renderCell(column, row)}
                      </TableCell>
                    ))}
                    {renderRowActions && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {renderRowActions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => {
                setRowsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[60px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {startItem} - {endItem} of {sortedData.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'ghost'}
                    size="icon"
                    className={currentPage === page ? 'bg-muted text-foreground' : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>
              }
              return null
            })}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
