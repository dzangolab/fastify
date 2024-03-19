import "@dzangolab/fastify-mercurius";
import { BaseService as I, formatDate as m } from "@dzangolab/fastify-slonik";
import { v4 as S } from "uuid";
import k from "busboy";
import { DeleteObjectCommand as x, GetObjectCommand as p, HeadObjectCommand as A, ListObjectsCommand as N, S3Client as R } from "@aws-sdk/client-s3";
import { Upload as P } from "@aws-sdk/lib-storage";
import { getSignedUrl as O } from "@aws-sdk/s3-request-presigner";
import U from "@fastify/multipart";
import h from "fastify-plugin";
import { sql as g } from "slonik";
import { processRequest as F } from "graphql-upload-minimal";
const y = "files", L = "optionsBucket", D = "fileFieldsBucket", M = "add-suffix", $ = "error", B = async (i) => new Promise((t, n) => {
  const e = [];
  i.on("data", (s) => e.push(s)), i.once("end", () => t(Buffer.concat(e))), i.once("error", n);
}), K = (i) => i.replace(/\.[^.]+$/, ""), j = (i) => {
  const t = i.lastIndexOf(".");
  return t === -1 ? "" : i.slice(t + 1);
}, v = (i, t, n) => n === L && i ? i : n === D && t || t && !i ? t : i && !t ? i : t === i ? t : t || i, V = (i, t, n) => {
  const e = i.Contents, s = new RegExp(
    `${t}-(\\d+)\\.${n}$`
  ), a = e?.reduce((r, u) => {
    const c = u.Key?.match(s);
    if (c) {
      const l = Number.parseInt(c[1]);
      return Math.max(r, l);
    }
    return r;
  }, 0), o = a ? a + 1 : 1;
  return `${t}-${o}.${n}`;
}, H = (i, t, n) => {
  const e = k({
    headers: i.headers
  }), s = {}, a = {};
  e.on("field", (o, r) => {
    s[o] = r;
  }), e.on(
    "file",
    (o, r, u) => {
      const c = [];
      r.on("data", (l) => {
        c.push(l);
      }), r.on("end", () => {
        const l = Buffer.concat(c);
        a[o] || (a[o] = []), a[o].push({
          ...u,
          mimetype: u.mimeType,
          data: l
        });
      });
    }
  ), e.on("finish", () => {
    i.body = {
      ...s,
      ...a
    }, n(null, i.body);
  }), e.on("error", (o) => {
    console.log(o);
  }), t.pipe(e);
};
class W {
  _bucket = void 0;
  _config;
  _storageClient;
  constructor(t) {
    this._config = t, this._storageClient = this.init();
  }
  get config() {
    return this._config;
  }
  get bucket() {
    return this._bucket;
  }
  set bucket(t) {
    this._bucket = t;
  }
  /**
   * Deletes an object from the Amazon S3 bucket.
   * @param {string} filePath - The path of the object to delete in the S3 bucket.
   * @returns {Promise<DeleteObjectCommandOutput>} A promise that resolves when the object is successfully deleted.
   */
  async delete(t) {
    const n = new x({
      Bucket: this.bucket,
      Key: t
    });
    return await this._storageClient.send(n);
  }
  /**
   * Generates a presigned URL for downloading a file from the specified S3 bucket.
   *
   * @param {string} filePath - The path or key of the file in the bucket.
   * @param {string} originalFileName - The name to be used when downloading the file.
   * @param {number} signedUrlExpiresInSecond - (Optional) The expiration time of the presigned URL in seconds (default: 3600 seconds).
   * @returns {Promise<string | undefined>} A Promise that resolves with the generated presigned URL or undefined if an error occurs.
   */
  async generatePresignedUrl(t, n, e = 3600) {
    const s = new p({
      Bucket: this.bucket,
      Key: t,
      ResponseContentDisposition: `attachment; filename="${n}"`
    });
    return await O(this._storageClient, s, {
      expiresIn: e
    });
  }
  /**
   * Retrieves a file from the specified S3 bucket.
   *
   * @param {string} filePath - The path or key of the file to retrieve from the bucket.
   * @returns {Promise<{ ContentType: string, Body: Buffer }>} A Promise that resolves with the retrieved file's content type and content as a Buffer.
   */
  async get(t) {
    const n = new p({
      Bucket: this.bucket,
      Key: t
    }), e = await this._storageClient.send(n), s = e.Body, a = await B(s);
    return {
      ContentType: e.ContentType,
      Body: a
    };
  }
  /**
   * Uploads a file to the specified S3 bucket.
   *
   * @param {Buffer} fileStream - The file content as a Buffer.
   * @param {string} key - The key (file name) to use when storing the file in the bucket.
   * @param {string} mimetype - The MIME type of the file.
   * @returns {Promise<PutObjectCommandOutput>} A Promise that resolves with information about the uploaded object.
   */
  async upload(t, n, e) {
    return await new P({
      client: this._storageClient,
      params: {
        Bucket: this.bucket,
        Key: n,
        Body: t,
        ContentType: e
      }
    }).done();
  }
  /**
   * Checks if a file with the given key exists in the S3 bucket.
   * @param key - The key (combination of path & file name) to check for in the bucket.
   * @returns Promise<boolean> - True if the file exists; otherwise, false.
   */
  async isFileExists(t) {
    try {
      const n = new A({
        Bucket: this.bucket,
        Key: t
      });
      return !!await this._storageClient.send(n);
    } catch (n) {
      if (n.name === "NotFound")
        return !1;
      throw n;
    }
  }
  /**
   * Retrieves a list of objects from the S3 bucket with a specified prefix.
   *
   * @param {string} baseName - The prefix used to filter objects within the S3 bucket.
   * @returns {Promise<ListObjectsCommandOutput>} A Promise that resolves to the result of the list operation.
   */
  async getObjects(t) {
    return await this._storageClient.send(
      new N({
        Bucket: this.bucket,
        Prefix: t
      })
    );
  }
  init() {
    return new R({
      credentials: {
        accessKeyId: this.config.s3.accessKey,
        secretAccessKey: this.config.s3.secretKey
      },
      endpoint: this.config.s3.endPoint,
      forcePathStyle: this.config.s3.forcePathStyle,
      region: this.config.s3.region
    });
  }
}
class dt extends I {
  _filename = void 0;
  _fileExtension = void 0;
  _path = void 0;
  _s3Client;
  get table() {
    return this.config.s3?.table?.name || y;
  }
  get filename() {
    return this._filename && !this._filename.endsWith(this.fileExtension) ? `${this._filename}.${this.fileExtension}` : this._filename || `${S()}.${this.fileExtension}`;
  }
  set filename(t) {
    this._filename = t;
  }
  get fileExtension() {
    return this._fileExtension;
  }
  set fileExtension(t) {
    this._fileExtension = t;
  }
  get path() {
    return this._path;
  }
  set path(t) {
    this._path = t;
  }
  get key() {
    let t = "";
    return this.path && (t = this.path.endsWith("/") ? this.path : this.path + "/"), `${t}${this.filename}`;
  }
  get s3Client() {
    return this._s3Client ?? (this._s3Client = new W(this.config));
  }
  deleteFile = async (t, n) => {
    const e = await this.findById(t);
    if (!e)
      throw new Error(`File with ID ${t} not found.`);
    this.s3Client.bucket = n?.bucket || e.bucket;
    const s = await this.delete(t);
    return s && await this.s3Client.delete(e.key), s;
  };
  download = async (t, n) => {
    const e = await this.findById(t);
    if (!e)
      throw new Error(`File with ID ${t} not found.`);
    this.s3Client.bucket = n?.bucket || e.bucket;
    const s = await this.s3Client.get(e.key);
    return {
      ...e,
      mimeType: s?.ContentType,
      fileStream: s.Body
    };
  };
  presignedUrl = async (t, n) => {
    const e = await this.findById(t);
    if (!e)
      throw new Error(`File with ID ${t} not found.`);
    this.s3Client.bucket = n.bucket || e.bucket;
    const s = await this.s3Client.generatePresignedUrl(
      e.key,
      e.originalFileName,
      n.signedUrlExpiresInSecond
    );
    return {
      ...e,
      url: s
    };
  };
  upload = async (t) => {
    const { fileContent: n, fileFields: e } = t.file, { filename: s, mimetype: a, data: o } = n, {
      path: r = "",
      bucket: u = "",
      bucketChoice: c,
      filenameResolutionStrategy: l
    } = t.options || {}, w = j(s);
    this.fileExtension = w, this.path = r, this.s3Client.bucket = v(u, e?.bucket, c) || "";
    let d = this.key;
    const b = await this.s3Client.isFileExists(d), T = l || this.config.s3.filenameResolutionStrategy;
    if (b)
      switch (T) {
        case $:
          throw new Error("File already exists in S3.");
        case M: {
          const f = K(this.filename), E = await this.s3Client.getObjects(f), _ = V(
            E,
            f,
            this.fileExtension
          );
          this.filename = _, d = this.key;
          break;
        }
      }
    if (!await this.s3Client.upload(o, d, a))
      return;
    const C = {
      ...e && { ...e },
      ...e?.uploadedAt && {
        uploadedAt: m(new Date(e.uploadedAt))
      },
      ...e?.lastDownloadedAt && {
        lastDownloadedAt: m(new Date(e.lastDownloadedAt))
      },
      originalFileName: s,
      key: d
    };
    return this.create(C);
  };
}
const Y = (i) => {
  const t = i.s3?.table?.name || y;
  return g.unsafe`
    CREATE TABLE IF NOT EXISTS ${g.identifier([t])} (
        id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        original_file_name VARCHAR(255) NOT NULL,
        bucket VARCHAR(255),
        description TEXT,
        key VARCHAR(255) NOT NULL,
        uploaded_by_id VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP NOT NULL,
        download_count INT DEFAULT 0,
        last_downloaded_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;
}, z = async (i, t) => {
  await i.connect(async (n) => {
    await n.query(Y(t));
  });
}, X = (i, t, n) => {
  i.addHook("preValidation", async (e, s) => {
    e.mercuriusUploadMultipart && (e.body = await F(e.raw, s.raw, t));
  }), n();
}, G = h(X, {
  fastify: ">= 4.x",
  name: "mercurius-upload"
}), J = async (i, t, n) => {
  i.log.info("Registering fastify-s3 plugin");
  const { config: e, slonik: s } = i;
  await z(s, e), e.rest.enabled && await i.register(U, {
    addToBody: !0,
    sharedSchemaId: "fileSchema",
    limits: {
      fileSize: e.s3.fileSizeLimitInBytes || Number.POSITIVE_INFINITY
    }
  }), e.mercurius.enabled && await i.register(G, {
    maxFileSize: e.s3.fileSizeLimitInBytes || Number.POSITIVE_INFINITY
  }), n();
}, ht = h(J), Q = (i, t, n) => {
  i.hasContentTypeParser("multipart") || i.addContentTypeParser("multipart", (e, s, a) => {
    e.config.mercurius.enabled && e.routerPath.startsWith(e.config.mercurius.path) ? (e.mercuriusUploadMultipart = !0, a(null)) : H(e, s, a);
  }), n();
}, ft = h(Q);
export {
  dt as FileService,
  W as S3Client,
  ht as default,
  ft as multipartParserPlugin
};
