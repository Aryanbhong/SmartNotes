import localforage from "localforage";

const NOTES_KEY = "smartnotes_offline_notes";

// Initialize localforage
localforage.config({
  name: "SmartNotes",
  storeName: "notes",
});

export const saveNoteOffline = async (note) => {
  try {
    const allNotes = (await localforage.getItem(NOTES_KEY)) || [];
    const updatedNotes = [...allNotes, { ...note, _offline: true }];
    await localforage.setItem(NOTES_KEY, updatedNotes);
  } catch (err) {
    console.error("Error saving note offline:", err);
  }
};

export const getOfflineNotes = async () => {
  try {
    return (await localforage.getItem(NOTES_KEY)) || [];
  } catch (err) {
    console.error("Error fetching offline notes:", err);
    return [];
  }
};

export const removeOfflineNote = async (id) => {
  try {
    const allNotes = (await localforage.getItem(NOTES_KEY)) || [];
    const updatedNotes = allNotes.filter((n) => n.id !== id);
    await localforage.setItem(NOTES_KEY, updatedNotes);
  } catch (err) {
    console.error("Error removing offline note:", err);
  }
};

export const clearOfflineNotes = async () => {
  try {
    await localforage.setItem(NOTES_KEY, []);
  } catch (err) {
    console.error("Error clearing offline notes:", err);
  }
};
