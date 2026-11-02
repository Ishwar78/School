const DATABASE_NAME = "eduflow-local-files";
const STORE_NAME = "files";
const DATABASE_VERSION = 1;

export const MAX_FILE_COUNT = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "text/plain",
];

export function validateFiles(files, existingCount = 0) {
  if (existingCount + files.length > MAX_FILE_COUNT) {
    return `You can attach up to ${MAX_FILE_COUNT} files.`;
  }

  for (const file of files) {
    const extension = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "jpg",
      "jpeg",
      "png",
      "txt",
    ];

    const typeIsKnown =
      !file.type ||
      file.type === "application/octet-stream" ||
      ALLOWED_FILE_TYPES.includes(file.type);
    if (!allowedExtensions.includes(extension) || !typeIsKnown) {
      return `${file.name} is not a supported file type.`;
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return `${file.name} must be between 1 byte and 10 MB.`;
    }
  }

  return "";
}

function openDatabase() {
  if (!window.indexedDB) {
    return Promise.reject(
      new Error("This browser does not support local file storage."),
    );
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "storageRef" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error("Unable to open local file storage."));
  });
}

export async function saveLocalFile(file, details) {
  const database = await openDatabase();
  const storageRef = crypto.randomUUID();
  const metadata = {
    id: crypto.randomUUID(),
    assignmentId: details.assignmentId,
    submissionId: details.submissionId || "",
    filename: file.name,
    originalFilename: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy: details.uploadedBy,
    storageRef,
    backendFileId: "",
    fileUrl: "",
  };

  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).add({ storageRef, blob: file });
      transaction.oncomplete = resolve;
      transaction.onerror = () =>
        reject(transaction.error || new Error(`Unable to save ${file.name}.`));
      transaction.onabort = () =>
        reject(transaction.error || new Error(`Unable to save ${file.name}.`));
    });
  } finally {
    database.close();
  }
  return metadata;
}

export async function saveLocalFiles(files, details) {
  const saved = [];

  try {
    for (const file of files) {
      saved.push(await saveLocalFile(file, details));
    }
    return saved;
  } catch (error) {
    await Promise.all(saved.map((file) => deleteLocalFile(file.storageRef)));
    throw error;
  }
}

export async function getLocalFile(storageRef) {
  const database = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const request = database
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME)
        .get(storageRef);
      request.onsuccess = () => resolve(request.result?.blob || null);
      request.onerror = () =>
        reject(request.error || new Error("Unable to read the saved file."));
    });
  } finally {
    database.close();
  }
}

export async function deleteLocalFile(storageRef) {
  if (!storageRef || !window.indexedDB) {
    return;
  }

  const database = await openDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(storageRef);
      transaction.oncomplete = resolve;
      transaction.onerror = () =>
        reject(transaction.error || new Error("Unable to remove the saved file."));
    });
  } finally {
    database.close();
  }
}

export function formatFileSize(size) {
  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
