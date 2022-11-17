//@ts-check

/**
 * helper functions to interact with the firebase
 */

import {
  collection,
  collectionGroup,
  getDoc,
  getDocFromCache,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  limit,
  addDoc,
  deleteDoc,
  onSnapshot,
  increment,
  updateDoc,
} from "firebase/firestore";
import { useFirebaseStore } from "./firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { defineStore } from "pinia";
import axios from "axios";
export const useHelperStore = defineStore("helpers", {
  state: () => ({
    fb: useFirebaseStore(),
  }),
  actions: {
    /**
     *
     * @param {String} collection - the collection to get the document from
     * @param {String} id - the id of the document
     * @returns - the document
     *
     * This function gets a document from the firestore
     *
     * @example
     * const doc = await getDocFromCollection("users", "1234");
     * console.log(doc);
     *  // {
     * //   "name": "John Doe",
     * //   "age": 21
     * // }
     *
     */
    async getDoc(collection, id) {
      //@ts-ignore
      const docRef = doc(this.fb.db, collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    },
    /**
     *
     * @param {String} collection - the collection to get the document from
     * @param {String} id - the id of the document
     * @returns - the document
     *
     * This function is used to get the document from the cache
     *
     * @example
     * const doc = await getDocFromCache("users", "1234");
     * console.log(doc);
     * // {
     * //   "name": "John Doe",
     * //   "age": 21
     * // }
     * */
    async getDocFromCache(collection, id) {
      //@ts-ignore
      const docRef = doc(this.fb.db, collection, id);
      const docSnap = await getDocFromCache(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    },
    /**
     *
     * @param {String} _collection - the collection to get the document from
     * @returns - the documents
     *
     * This function is used to get all the documents from a collection
     *
     * @example
     * const docs = await getCollection("users");
     * console.log(docs);
     * // [
     * //   {
     * //     "name": "John Doe",
     * //     "age": 21
     * //   },
     * //   {
     * //     "name": "Jane Doe",
     * //     "age": 21
     * //   }
     * // ]
     * */
    async getCollection(_collection) {
      //@ts-ignore
      const querySnapshot = await getDocs(collection(this.fb.db, _collection));
      const docs = {};
      querySnapshot.forEach((doc) => {
        docs[doc.id] = doc.data();
      });
      return docs;
    },
    /**
     *
     * @param {String} collection - the collection to get the document from
     * @return - the documents
     *
     * This function is used to get all the documents from a collection group
     *
     * @example
     * If clothing is a subcollection of users;
     * const docs = await getCollectionGroup("clothing");
     * console.log(docs);
     * //
     * // [
     * //   {
     * //     "type: "shirt",
     * //     "size": "large"",
     * //     "color": "red"
     * //   },
     * //   {
     * //     "type: "pants",
     * //     "size": "medium"",
     * //     "color": "blue"
     * //   }
     * // ]
     * */
    async getCollectionGroup(collection) {
      const querySnapshot = await getDocs(
        //@ts-ignore
        collectionGroup(this.fb.db, collection)
      );
      const docs = {};
      querySnapshot.forEach((doc) => {
        docs[doc.id] = doc.data();
      });
      return docs;
    },
	/**
	 * 
	 * @param {*} _collection - the collection to get the document from
	 * @param {*} id - the id of the document
	 * @param {*} subCollection - the subcollection to get the document from
	 * @param {*} _limit - the limit of the documents to get
	 * @returns - the documents
	 * 
	 * This function is used to get all the documents from a subcollection
	 * 
	 * @example
	 * If clothing is a subcollection of users;
	 * const docs = await getSubCollection("users", "1234", "clothing", 1);
	 * console.log(docs);
	 * //
	 * // [
	 * //   {
	 * //     "type: "shirt",
	 * //     "size": "large"",
	 * //     "color": "red"
	 * //   }
	 * // ] 
	 */
    async getDocSubCollectionWithLimit(_collection, id, subCollection, _limit) {
      const q = query(
	  //@ts-ignore
	  collection(this.fb.db, _collection, id, subCollection),
	  limit(_limit)
	  );
	  const querySnapshot = await getDocs(q);
	  const docs = [];
	  querySnapshot.forEach((doc) => {
		docs.push(doc.data());
	  });
	  return docs;
	},

    /**
     *
     * @param {String} _collection - the collection to get the document from
     * @param {String} field - the field to query
     * @param {String} operator - the operator to use
     * @param {*} value - the value to compare
     * @param {Number} _limit - the limit of the query
     * @returns - the documents
     *
     * This function is used to get all the documents from a collection where the field is equal to the value
     *
     * @example
     * const docs = await getCollectionWhere("users", "age", "==", 21, 2);
     * console.log(docs);
     * // [
     * //   {
     * //     "name": "John Doe",
     * //     "age": 21
     * //   },
     * //   {
     * //     "name": "Jane Doe",
     * //     "age": 21
     * //   }
     *
     */
    async getCollectionWhere(_collection, field, operator, value, _limit = 10) {
      const querySnapshot = await getDocs(
        query(
          //@ts-ignore
          collection(this.fb.db, _collection),
          //@ts-ignore
          where(field, operator, value),
          limit(_limit)
        )
      );
      const docs = {};
      querySnapshot.forEach((doc) => {
        docs[doc.id] = doc.data();
      });
      return docs;
    },
    /**
     *
     * @param {Array.<String>} _collection - the collection to get the document from
	 * @param {Array.<String>} fields - the fields to query
	 * @param {Array.<String>} operators - the operators to use
	 * @param {Array.<String>} values - the values to compare
	 * @param {Number} _limit - the limit of the query
     * @returns - the documents
     *
     * This function is used to get all the documents from a collection where the field is equal to the value
     *
     * @example
	 * const docs = await getCollectionWhere2XChain("users", "age", "==", 21, "name", "==", "John Doe", 2);
     * console.log(docs);
     *
     */
    async getCollectionWhere2XChain(
      _collection,
      fields,
	  operators,
	  values,
      _limit
    ) {
      //@ts-ignore
      const querySnapshot = await getDocs(
        query(
          //@ts-ignore
          collection(this.fb.db, _collection),
          //@ts-ignore
          where(fields[0], operators[0], values[0],
		  //@ts-ignore
		  where(fields[1], operators[1], values[1]),
          limit(_limit))
        )
      );
      const docs = [];
      querySnapshot.forEach((doc) => {
		docs.push({id:doc.id, data:doc.data()});
	});
      return docs;
    },
	/**
	 * 
	 * @param {String} _collection - the collection to get the document from
	 * @param {String} field - the field to query 
	 * @param {String} operator - the operator to use
	 * @param {*} value - the value to compare
	 * @param {Number} _limit - the limit of the query
	 * @returns - the documents
	 * 
	 * This function is used to get all the documents from a collection group where the field is equal to the value
	 * 
	 * @example
	 * const docs = await getCollectionGroupWhere("clothing", "type", "==", "shirt", 2);
	 * console.log(docs);
	 * // [
	 * //   {
	 * //      "type: "shirt",
	 * //	   "size": "large"",
	 * //	   "color": "red"
	 * //   },
	 * //   {
	 * //	   "type: "shirt",
	 * //	   "size": "medium"",
	 * //	   "color": "blue"
	 * //   }
	 * // ]
	 */
	async getCollectionGroupWhere(_collection, field, operator, value, _limit = 10) {
		const querySnapshot = await getDocs(
		  query(
			//@ts-ignore
			collectionGroup(this.fb.db, _collection),
			//@ts-ignore
			where(field, operator, value),
			limit(_limit)
		  )
		);
		const docs = {};
		querySnapshot.forEach((doc) => {
		  docs[doc.id] = doc.data();
		});
		return docs;
	},
    /**
     *
     * @param {String} collection
     * @param {String} id
     * @param {*} data
     * @returns - confirmation promise
     *
     * This function is used to update a document in a collection with merging enabled
     *
     * @example
     * await updateDoc("users", "1234", {
     *  "name": "John Doe",
     * "age": 21
     * });
     *
     */
    async setDoc(collection, id, data) {
      // @ts-ignore
      const docRef = doc(this.fb.db, collection, id);
      await setDoc(docRef, data, { merge: true })
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
          return false;
        });
    },
    /**
     *
     * @param {String} collection - the collection to get the document from
     * @param {String} id - the id of the document
     * @param {String} subcollection - the subcollection to get the document from
     * @param {String} subid - the id of the subdocument
     * @param {*} data - the data to update the document with
     * @returns - confirmation in the form of a promise
     *
     * This function is used to update a document in a subcollection with merging enabled
     *
     * @example
     *  await updateSubDoc("users", "1234", "clothing", "5678", {
     * "type": "shirt",
     * "size": "large",
     * "color": "red"
     * });
     *
     */
    async setDocInSubcollection(collection, id, subcollection, subid, data) {
      // @ts-ignore
      const docRef = doc(this.fb.db, collection, id, subcollection, subid);
      await setDoc(docRef, data, { merge: true })
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
          return false;
        });
    },
    /**
     *
     * @param {String} _collection
     * @param {*} data
     * @returns - document id
     *
     * This function is used to add a document to a collection
     *
     * @example
     * const id = await addDoc("users", {
     * "name": "John Doe",
     * "age": 21
     * });
     * console.log(id);
     * // 1234
     *
     */
    async addDoc(_collection, data) {
      // @ts-ignore
      await addDoc(collection(this.fb.db, _collection), data)
        .then((docRef) => {
          return docRef.id;
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          return false;
        });
    },
    /**
     *
     * @param {String} _collection
     * @param {String} id
     * @param {String} subcollection
     * @param {*} data
     * @returns - document id
     *
     * This function is used to add a document to a subcollection
     *
     * @example
     * const id = await addDocToSubcollection("users", "1234", "clothing", {
     * "type": "shirt",
     * "size": "large",
     * "color": "red"
     * });
     * console.log(id);
     * // 5678
     *
     */
    async addDocInSubcollection(_collection, id, subcollection, data) {
      // @ts-ignore
      await addDoc(collection(this.fb.db, _collection, id, subcollection), data)
        .then((docRef) => {
          return docRef.id;
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          return false;
        });
    },
    /**
     *
     * @param {String} collection - the collection to get the document from
     * @param {String} id - the id of the document
     * @returns - confirmation in the form of a promise
     * This function is used to delete a document from a collection
     *
     * @example
     * await deleteDoc("users", "1234");
     *
     */
    async deleteDoc(collection, id) {
      // @ts-ignore
      await deleteDoc(doc(this.fb.db, collection, id))
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
          return false;
        });
    },
    /**
     *
     * @param {String} collection - the collection to get the document from
     * @param {String} id - the id of the document
     * @param {String} subcollection - the subcollection to get the document from
     * @param {String} subid - the id of the subdocument
     * @returns - confirmation in the form of a promise
     *
     * This function is used to delete a document from a subcollection
     *
     * @example
     * await deleteDocInSubcollection("users", "1234", "clothing", "5678");
     *
     */
    async deleteDocInSubcollection(collection, id, subcollection, subid) {
      // @ts-ignore
      await deleteDoc(doc(this.fb.db, collection, id, subcollection, subid))
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
          return false;
        });
    },
    /**
     *
     * @param {File} file
     * @param {String} path
     * @returns - Snapshot of the upload
     *
     * This function is used to upload a file to the storage bucket
     *
     * @example
     * await uploadFile(file, "images/1234.jpg");
     *
     */
    async uploadAFileToStorage(file, path) {
      // @ts-ignore
      const storageRef = ref(this.fb.storage, path);
      await uploadBytes(storageRef, file)
        .then((snapshot) => {
          return snapshot;
        })
        .catch((error) => {
          console.error("Error uploading file: ", error);
          return false;
        });
    },
    /**
     *
     * @param {String} path
     * @returns - url in the form of a promise
     *
     * This function is used to get a url for a file in the storage bucket
     *
     * @example
     * const url = await getFileUrl("images/1234.jpg");
     * console.log(url);
     * // https://firebasegoogleapis.com/v0/b/your-project-id.appspot.com/o/images%2F1234.jpg?alt=media&token=1234
     */
    async getDownloadURL(path) {
      // @ts-ignore
      const storageRef = ref(this.fb.storage, path);
      const url = await getDownloadURL(storageRef)
	  if(url){
		return url;
	  }else{
		throw new Error("Error getting download url");
	  }
    },
    /**
     *
     * @param {String} path
     * @returns - confirmation in the form of a promise
     *
     * This function is used to delete a file from the storage bucket
     *
     * @example
     * await deleteFile("images/1234.jpg");
     *
     */
    async deleteFile(path) {
      // @ts-ignore
      const storageRef = ref(this.fb.storage, path);
      await deleteObject(storageRef)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error("Error deleting file: ", error);
          return false;
        });
    },
    /**
     *
     * @param {String} collection
     * @param {String} id
     * @param {Function} callback
     * @returns
     *
     * This function is used to listen for changes to a document
     *
     * @example
     * listenForDocChanges("users", "1234", (doc) => {
     * console.log(doc);
     * });
     *
     */
    listenToDocument(collection, id, callback) {
      // @ts-ignore
      return onSnapshot(doc(this.fb.db, collection, id), callback);
    },
    /**
     *
     * @param {String} _collection
     * @param {Function} callback
     * @returns
     *
     * This function is used to listen for changes to a collection
     *
     * @example
     * listenForCollectionChanges("users", (querySnapshot) => {
     * querySnapshot.forEach((doc) => {
     * console.log(doc);
     * });
     */
    listenToCollection(_collection, callback) {
      // @ts-ignore
      return onSnapshot(collection(this.fb.db, _collection), callback);
    },
    /**
     *
     * @param {*} docRef
     *
     * This function is used to stop listening for changes to a document
     *
     * @example
     *
     * const docRef = listenForDocChanges("users", "1234", (doc) => {
     * console.log(doc);
     * });
     *
     * stopListeningToDocument(docRef);
     *
     */
    stopListeningToDocument(docRef) {
      docRef();
    },
    /**
     *
     * @param {*} colRef
     *
     * This function is used to stop listening for changes to a collection
     *
     * @example
     *
     * const colRef = listenForCollectionChanges("users", (querySnapshot) => {
     * querySnapshot.forEach((doc) => {
     * console.log(doc);
     * });
     *
     * stopListeningToCollection(colRef);
     *
     *
     */
    stopListeningToCollection(colRef) {
      colRef();
    },
	/**
	 * 
	 * @param {String} collection - the collection to get the document from
	 * @param {String} id - the id of the document
	 * @param {String} field - the field to update
	 * @param {*} value - the value to update the field to
	 * 
	 * @description This function is used to increment a field in a document
	 * 
	 * @example
	 * 
	 * await incrementField("users", "1234", "age", 1);
	 * 
	 */
	async incrementField(collection, id, field, value) {
		// @ts-ignore
		await updateDoc(doc(this.fb.db, collection, id), {
		  [field]: increment(value),
		});
	},
	/**
	 * 
	 * @param {String} collection 
	 * @param {String} id 
	 * @param {String} subcollection 
	 * @param {String} subid 
	 * @param {String} field 
	 * @param {*} value
	 * 
	 * @description This function is used to increment a field in a subcollection
	 * 
	 * @example
	 * 
	 * await incrementFieldInSubcollection("users", "1234", "clothing", "5678", "price", 1); 
	 */
	async incrementFieldOfSubcollection(collection, id, subcollection, subid, field, value) {
		// @ts-ignore
		await updateDoc(doc(this.fb.db, collection, id, subcollection, subid), {
		  [field]: increment(value),
		});
	},
    /**
     *
     * @param {String} url - the url of the image
     * @param {String} method - the method to use
     * @param {*} data - the data to send
     * @param {*} headers - the headers to send
     * @returns - response in the form of a promise
     *
     * This function is used to make a request to a url
     *
     * @example
     * const response = await makeRequest("https://example.com", "GET", null, null);
     * console.log(response);
     *
     */
    async useRESTfulAPI(url, method, data, headers) {
      const resp = await axios({
        method: method,
        url: url,
        data: data,
        headers: headers,
      })
	  return resp;
    },
    /**
     *
     * @param {Number} daysFromNow - the number of days from now - cannot be negative
     * @param {Number} hourToSetTo - the hour to set the date to - cannot be negative
     * @param {boolean} now - boolean to set the date to now
     * @returns - the date
     *
     * This function is used to get today's date at set time or a date in the future at set time
     *
     * @example
     * const date = dateFactory(0, 12);
     * console.log(date);
     * // 2021-01-01T12:00:00.000Z
     *
     * const date = dateFactory(1, 12);
     * console.log(date);
     * // 2021-01-02T12:00:00.000Z
     *
     * const date = dateFactory(now=true);
     * console.log(date);
     * // 2022-01-01T12:54:22.136Z
     * */
    dateFactory(daysFromNow = 0, hourToSetTo = 0, now = false) {
      const date = new Date();
      if (now) {
        return date;
      } else {
        if (daysFromNow < 0) {
          throw new Error("daysFromNow cannot be negative");
        }
        if (hourToSetTo < 0) {
          throw new Error("hourToSetTo cannot be negative");
        }
        date.setDate(date.getDate() + daysFromNow);
        date.setHours(hourToSetTo,0,0,0);
        return date;
      }
    },
    /**
     *
     * @param {String} string - the string to be sanitized
     * @returns - the sanitized string
     *
     * This function is used to sanitize a string removing all special characters
     *
     * @example
     * const sanitizedString = sanitizeString("Hello World!");
     * console.log(sanitizedString);
     * // Hello World
     * */
    sanitizeString(string) {
      return string.replace(/[^a-zA-Z0-9 ]/g, "");
    },
    /**
     *
     * @param {*} object
     * @returns - the object
     *
     * This function is used to remove all empty values from an object and sanitize all strings fields from special characters
     *
     * @example
     * const object = {
     * name: "John Doe%",
     * age: 25,
     * address: "",
     * };
     *
     * const sanitizedObject = sanitizeObject(object);
     * console.log(sanitizedObject);
     * // {name: "John Doe", age: 25}
     *
     * */
    sanitizeObject(object) {
      Object.keys(object).forEach((key) => {
        if (typeof object[key] === "string") {
          object[key] = this.sanitizeString(object[key]);
        }
        if (object[key] === "") {
          delete object[key];
        }
      });
      return object;
    },
  },
  getters: {
    // ...
  },
});
