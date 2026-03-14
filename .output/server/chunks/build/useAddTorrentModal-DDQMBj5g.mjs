import { s as useState } from './server.mjs';

const useAddTorrentModal = () => {
  return useState("addTorrentModal", () => ({
    show: false,
    tab: "file"
  }));
};

export { useAddTorrentModal as u };
//# sourceMappingURL=useAddTorrentModal-DDQMBj5g.mjs.map
