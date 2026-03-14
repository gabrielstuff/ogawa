export const useAddTorrentModal = () => {
  return useState('addTorrentModal', () => ({
    show: false,
    tab: 'file' as 'file' | 'magnet' | 'url',
  }))
}
