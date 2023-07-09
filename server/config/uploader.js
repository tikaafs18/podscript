const multer = require('multer');
const fs = require('fs');

module.exports = {
    uploader: (directory, filePrefix) => {
        let defaultDir = './public';

        const storageUploader = multer.diskStorage({
            destination: (req, file, cb) => {
                const pathDir = directory ? defaultDir + directory : defaultDir;

                if (fs.existsSync(pathDir)) {
                    console.log(`Fungsi DESTINATION, ini result pengecekkan apakah directory sudah terbentuk.
                    // Directory ${pathDir} tersedia`);
                    cb(null, pathDir);
                } else {
                    fs.mkdir(pathDir, { recursive: true }, (err) => {
                        if (err) {
                            console.log(`Fungsi DESTINATION, directory ${pathDir} tidak ditemukan dan GAGAL dibuat. Dengan error : `, err)
                        }

                        console.log(`Fungsi DESTINATION, directory ${pathDir} BERHASIL dibuat`);
                        return (cb, pathDir);
                    })
                }
            },
            filename: (req, file, cb) => {
                //Membaca format file
                console.log("File masuk ke uploader edit format file")
                let ext = file.originalname.split('.');

                //filePrefix = inputan dari argumen di middleware UPLOADER
                let newName = filePrefix + Date.now() + '.' + ext[ext.length - 1];

                console.log('Ini fungsi edit filename. New file name berhasil dibuat : ', newName);
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