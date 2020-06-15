import datastore from "../persistence/datastore";

const ENTRY_COLLECTION_NAME = 'entries';

export default class EntryService {
  async fetchEntriesForDate(date: string) {
    let items = [];
    let docId = null;
    let title = null;

    try {
      let querySnapshot = await datastore
        .collection(ENTRY_COLLECTION_NAME)
        .where("date", "==", date)
        .get();
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        docId = doc.id;
        title = data.title;
        items = data.data;
      });
    } catch(err) {
      console.error(err);
    }

    return { docId, title, items };
  }

  async setEntry(docId, data) {
    if (!!docId) {
      await this._updateEntry(docId, data);
      return null;
    } else {
      let insertedDocId = await this._insertEntry(data);
      return insertedDocId;
    }
  }

  async _updateEntry(docId, data) {
    try {
      await datastore
        .collection(ENTRY_COLLECTION_NAME)
        .doc(docId)
        .update({
          title: data.title,
          data: data.entries,
        });
    } catch(err) {
      console.error(err);
    }
  }

  async _insertEntry(data) {
    let insertedDocId = null;
    try {
      let docRef = await datastore.collection(ENTRY_COLLECTION_NAME)
      .add({
        date: data.date,
        title: data.title,
        data: data.entries
      });

      insertedDocId = (!!docRef) ? docRef.id: null;
    } catch(err) {
      console.error(err);
    }

    return insertedDocId;
  }
}
