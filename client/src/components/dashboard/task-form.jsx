import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const priorities = ['Low', 'Medium', 'High']

export default function TaskFormModal({ task, onSubmit, open, setOpen }) {
  const [formState, setFormState] = useState('idle')

  const { register, handleSubmit, reset, formState: rhfState } = useForm({
    defaultValues: {
      id: task?._id || '',
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'Medium',
    },
  })

  const submitTask = async (data) => {
    setFormState('loading')
    try {
      await onSubmit(data)
      setFormState('success')
      setTimeout(() => {
        setOpen(false)
        setFormState('idle')
        if (!task) reset()
      }, 1000)
    } catch (err) {
      alert(
        err?.response?.data?.error || `Failed to ${task ? 'update' : 'add'} task`
      )
      setFormState('idle')
    }
  }

  useEffect(() => {
    if (task) {
      reset({
        id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        version: task.version,
      })
    } else {
      reset({ id: '', title: '', description: '', priority: 'Medium' })
    }
  }, [task, reset])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitTask)} className="space-y-4">
          {task && (
            <input type="hidden" {...register('id')} />
          )}
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              {...register('title', { required: true })}
              placeholder="Task title"
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              {...register('description')}
              placeholder="Task description"
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Priority</label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formState === 'loading' || rhfState.isSubmitting}
            >
              {formState === 'loading'
                ? 'Saving...'
                : task
                  ? 'Save Task'
                  : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
