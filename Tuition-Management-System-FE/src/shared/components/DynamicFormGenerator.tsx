import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'

// Types for dynamic fields
interface DynamicFieldOption {
  value: string
  label: string
  description?: string
  isDefault?: boolean
}

interface DynamicFieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  allowedValues?: string[]
}

interface DynamicField {
  id: string
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'number' | 'email' | 'phone' | 'url' | 'date' | 'file' | 'rating'
  label: string
  placeholder?: string
  description?: string
  visible: boolean
  order: number
  validation?: DynamicFieldValidation
  options?: DynamicFieldOption[]
  defaultValue?: any
  size: 'small' | 'medium' | 'large'
  multiline?: boolean
  searchable?: boolean
}

interface DynamicFormSection {
  id: string
  type: string
  title: string
  description?: string
  visible: boolean
  order: number
  required: boolean
  size: 'small' | 'medium' | 'large' | 'full'
  fields: DynamicField[]
  config?: Record<string, any>
}

interface DynamicFormGeneratorProps {
  sections: DynamicFormSection[]
  defaultValues?: Record<string, any>
  onSubmit: (data: any) => void
  isLoading?: boolean
  disabled?: boolean
}

// Generate Zod schema from dynamic fields
const generateZodSchema = (sections: DynamicFormSection[]) => {
  const schemaFields: Record<string, any> = {}

  sections.forEach(section => {
    section.fields.forEach(field => {
      if (!field.visible) return

      let fieldSchema: any

      switch (field.type) {
        case 'text':
        case 'email':
        case 'phone':
        case 'url':
          fieldSchema = z.string()
          break
        case 'textarea':
          fieldSchema = z.string()
          break
        case 'number':
          fieldSchema = z.number()
          break
        case 'date':
          fieldSchema = z.string()
          break
        case 'select':
          fieldSchema = z.string()
          break
        case 'multiselect':
          fieldSchema = z.array(z.string())
          break
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'radio':
          fieldSchema = z.string()
          break
        case 'rating':
          fieldSchema = z.number()
          break
        case 'file':
          fieldSchema = z.any()
          break
        default:
          fieldSchema = z.string()
      }

      // Apply validations
      if (field.validation) {
        const validation = field.validation

        if (validation.required) {
          fieldSchema = fieldSchema.min ? fieldSchema.min(1) : fieldSchema.nonempty()
        }

        if (validation.minLength) {
          fieldSchema = fieldSchema.min(validation.minLength)
        }

        if (validation.maxLength) {
          fieldSchema = fieldSchema.max(validation.maxLength)
        }

        if (validation.min) {
          fieldSchema = fieldSchema.min(validation.min)
        }

        if (validation.max) {
          fieldSchema = fieldSchema.max(validation.max)
        }

        if (validation.pattern) {
          fieldSchema = fieldSchema.regex(new RegExp(validation.pattern))
        }

        if (validation.allowedValues) {
          fieldSchema = fieldSchema.refine((val: any) => validation.allowedValues!.includes(val), {
            message: `Value must be one of: ${validation.allowedValues.join(', ')}`,
          })
        }
      } else {
        // Make field optional if no validation
        fieldSchema = fieldSchema.optional()
      }

      schemaFields[field.id] = fieldSchema
    })
  })

  return z.object(schemaFields)
}

// Render individual field component
const FieldRenderer: React.FC<{
  field: DynamicField
  control: any
  value?: any
  onChange: (value: any) => void
}> = ({ field, control, value, onChange }) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...controllerField}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={controllerField.value || ''}
                    onChange={(e) => {
                      controllerField.onChange(e)
                      onChange(e.target.value)
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'textarea':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...controllerField}
                    placeholder={field.placeholder}
                    rows={field.multiline ? 4 : 2}
                    value={controllerField.value || ''}
                    onChange={(e) => {
                      controllerField.onChange(e)
                      onChange(e.target.value)
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'number':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...controllerField}
                    type="number"
                    placeholder={field.placeholder}
                    value={controllerField.value || ''}
                    onChange={(e) => {
                      const numValue = e.target.value ? Number(e.target.value) : ''
                      controllerField.onChange(numValue)
                      onChange(numValue)
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'select':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  value={controllerField.value || ''}
                  onValueChange={(value) => {
                    controllerField.onChange(value)
                    onChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || 'Select an option'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'multiselect':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${option.value}`}
                        checked={(controllerField.value || []).includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValue = controllerField.value || []
                          const newValue = checked
                            ? [...currentValue, option.value]
                            : currentValue.filter((v: string) => v !== option.value)
                          controllerField.onChange(newValue)
                          onChange(newValue)
                        }}
                      />
                      <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'checkbox':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={controllerField.value || false}
                    onCheckedChange={(checked) => {
                      controllerField.onChange(checked)
                      onChange(checked)
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'radio':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${option.value}`}
                        checked={(controllerField.value || []) === option.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            controllerField.onChange(option.value)
                            onChange(option.value)
                          }
                        }}
                      />
                      <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'date':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...controllerField}
                    type="date"
                    value={controllerField.value || ''}
                    onChange={(e) => {
                      controllerField.onChange(e)
                      onChange(e.target.value)
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'file':
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...controllerField}
                    type="file"
                    onChange={(e) => {
                      controllerField.onChange(e.target.files?.[0])
                      onChange(e.target.files?.[0])
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return (
          <Controller
            name={field.id}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...controllerField}
                    placeholder={field.placeholder}
                    value={controllerField.value || ''}
                    onChange={(e) => {
                      controllerField.onChange(e)
                      onChange(e.target.value)
                    }}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )
    }
  }

  return <>{renderField()}</>
}

export const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({
  sections,
  defaultValues = {},
  onSubmit,
  isLoading = false,
  disabled = false,
}) => {
  // Generate form schema
  const formSchema = generateZodSchema(sections)

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  })

  const handleSubmit = (data: any) => {
    onSubmit(data)
  }

  // Sort sections by order
  const sortedSections = sections
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {sortedSections.map((section) => (
          <Card key={section.id} className={`w-full ${section.size === 'full' ? 'col-span-full' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {section.title}
                {section.required && <Badge variant="destructive">Required</Badge>}
              </CardTitle>
              {section.description && (
                <CardDescription>{section.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sort fields by order */}
              {section.fields
                .filter(field => field.visible)
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    control={form.control}
                    value={form.getValues(field.id)}
                    onChange={(value) => form.setValue(field.id, value)}
                  />
                ))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading || disabled}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading || disabled}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
