const multer = require('multer');
const fs = require('fs');

module.exports = {
    uploader: (directory, filePrefix) => {
        let defaultDir = './public';

        const storageUploader = multer.diskStorage({
            destination: (req, file, cb) => {
                const pathDir = directory ? defaultDir + directory : defaultDir;

                if (fs.existsSync(pathDir)) {
                    cb(null, pathDir);
                } else {
                    fs.mkdir(pathDir, { recursive: true }, (err) => {
                        if (err) {
                            console.log(`Fungsi DESTINATION, directory ${pathDir} tidak ditemukan dan GAGAL dibuat. Dengan error : `, err)
                        }
                        return (cb, pathDir);
                    })
                }
            },
            filename: (req, file, cb) => {
                //Membaca format file
                let ext = file.originalname.split('.');

                //filePrefix = input dari argumen di middleware UPLOADER
                let newName = filePrefix + Date.now() + '.' + ext[ext.length - 1];

                cb(null, newName);
            }
        })

        const fileFilter = (req, file, cb) => {
            const extFilter = /\.(jpg|png|webp|jpeg|svg)/;

            if (file.originalname.toLowerCase().match(extFilter)) {
                cb(null, true);
            } else {
                cb(new Error('Your file format is denied', false));
            }
        }

        return multer({ storage: storageUploader, fileFilter });
    }
}