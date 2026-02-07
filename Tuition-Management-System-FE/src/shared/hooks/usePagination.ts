import { useState, useCallback } from 'react'
import type { PaginationParams, PaginatedResponse } from '../types'

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

interface UsePaginationReturn<T> {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  resetPagination: () => void
  paginationParams: PaginationParams
  getPaginationInfo: (response: PaginatedResponse<T>) => {
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    startItem: number
    endItem: number
  }
}

export function usePagination<T>({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationOptions = {}): UsePaginationReturn<T> {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1))
  }, [])

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage))
  }, [])

  const resetPagination = useCallback(() => {
    setPage(initialPage)
    setLimit(initialLimit)
  }, [initialPage, initialLimit])

  const getPaginationInfo = useCallback(
    (response: PaginatedResponse<T>) => {
      const { meta } = response
      const startItem = (page - 1) * limit + 1
      const endItem = Math.min(page * limit, meta.total)

      return {
        total: meta.total,
        totalPages: meta.totalPages,
        hasNextPage: meta.hasNextPage,
        hasPrevPage: meta.hasPrevPage,
        startItem,
        endItem,
      }
    },
    [page, limit]
  )

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    paginationParams: { page, limit },
    getPaginationInfo,
  }
}
