const fs = require('fs');
const path = require('path');
const multer = require('multer')

const allowedFormats = {
    image: ['.png', '.jpg', '.gif', '.jpeg'],
    video: ['.mp4', '.mov', '.wmv', '.avi'],
    doc: [
        '.pdf',
        '.html',
        '.ppt',
        '.pptx',
        '.xlsx',
        '.png',
        '.jpg',
        '.gif',
        '.jpeg',
    ],
    audio: ['.aac', '.m4a', '.mp3'],
};

/**
 * Upload media Local/AWS
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports.uploadMedia = async (req, res, next) => {
    try {
        req.params.mediaFor = 'movies';
        req.params.mediaType = 'doc';
        const badError = 400;
        const { params } = req;
        const multerStorage = await getStorage(
        );
        multerStorage.single('file')(req, res, async (error) => {
            this.error = error;
            // if (!error && !metaData) {
            //   this.error = new Error(utility.getMessage(req, false, 'MEDIA_INVALID'));
            // }

            if (this.error instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                if (this.error.code === 'LIMIT_FILE_SIZE') {
                    this.error.message = utility.getMessage(req, false, 'TOO_LARGE_FILE');
                }
                this.error.status = badError;
                return next(this.error);
            }
            if (this.error) {
                // An unknown error occurred when uploading.
                this.error.status = badError;
                return next(this.error);
            }

            next();
        });
    } catch (error) {
        next(error);
    }
};

async function getStorage(type = 'local') {
    return multer({
        storage: storage,
        fileFilter: (req, file, callback) => {
            let fileFormats = [];
            const {
                params: { mediaType },
            } = req;
            const ext = path.extname(file.originalname);
            if (mediaType === 'image') {
                fileFormats = allowedFormats.image;
            } else if (mediaType === 'video') {
                fileFormats = allowedFormats.video;
            } else if (mediaType === 'doc') {
                fileFormats = allowedFormats.doc;
            } else if (mediaType === 'audio') {
                fileFormats = allowedFormats.audio;
            }
            if (!fileFormats.includes(ext.toLowerCase())) {
                return callback(new Error('Invalid file format.'));
            }
            callback(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 25,
        },
    });
}

// using below function for local file system diskStorage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const {
            params: { mediaFor },
        } = req;
        const fileDir = path.join(
            // eslint-disable-next-line no-undef
            path.resolve(),
            `/public/uploads/${mediaFor}/thumb`
        );
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true }, (err) => {
                throw Error(err);
            });
        }
        file.thumbDir = fileDir;
        cb(null, `public/uploads/${mediaFor}/`);
    },

    filename: (_req, file, cb) => {
        const dateTimestamp = Date.now();
        const filename = file.originalname.replace(/[^A-Z0-9.]/gi, '-');
        const fileArray = filename.split('.');
        const ext = fileArray.pop();
        cb(null, `${fileArray.join('-')}-${dateTimestamp}.${ext}`);
    },
});