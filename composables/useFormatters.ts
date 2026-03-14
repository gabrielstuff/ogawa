export const useFormatters = () => {
  const formatSize = (bytes: number | undefined | null): string => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatSpeed = (bytesPerSecond: number | undefined | null): string => {
    if (!bytesPerSecond || bytesPerSecond === 0) return '0'
    return formatSize(bytesPerSecond)
  }

  const formatDate = (date: string | undefined | null): string => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  const getProgressPercent = (completed: number | undefined | null, total: number | undefined | null): number => {
    if (!total || total === 0) return 0
    if (!completed) return 0
    return Math.min(100, Math.round((completed / total) * 100))
  }

  return {
    formatSize,
    formatSpeed,
    formatDate,
    getProgressPercent,
  }
}
