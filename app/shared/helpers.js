const { buildErrObject } = require('../middleware/utils')
const mongoose = require('mongoose')
// const querystring = require('querystring')
const AWS = require('aws-sdk')
const { resolve } = require('path')
const { rejects } = require('assert')
const ACCESS_KEY = process.env.AWS_ACCESS_KEY
const SECRET_KEY = process.env.AWS_SECRET_KEY
const Bucket = 'uat-presshope' // process.env.Bucket
const REGION = 'eu-west-2' // process.env.REGION

const bucket = new AWS.S3({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION
})

const Admin = require('../models/admin')
const User = require('../models/user')
const OfficeDetails = require('../models/office_detail')
module.exports = {
  /**
   * in case need to get id without requireAuth
   * @param {String} token - binary file with path
   */

  async getUserIdFromToken(token) {
    return new Promise((resolve, reject) => {
      const jwt = require('jsonwebtoken')
      const auth = require('../middleware/auth')
      jwt.verify(
        auth.decrypt(token),
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            reject(buildErrObject(401, 'Unauthorized'))
          }
          resolve(decoded.data)
        }
      )
    })
  },

  /**
   * upload file to server
   * @param {Object} object - binary file with path
   */

  async uploadFile(object) {
    return new Promise((resolve, reject) => {
      const obj = object.file
      const name = Date.now() + obj.name
      obj.mv(`${object.path}/${name}`, err => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(name)
      })
    })
  },

  async getUserMediaHouseId(userId) {
    try {
      // Fetch user from user collection
      const user = await User.findById(userId)

      if (!user) {
        throw new Error('User not found')
      }

      // Check the role of the user
      if (user.role !== 'MediaHouse') {
        // Fetch office details if the role is not 'mediaHouse'
        const office = await OfficeDetails.findById(user.office_id)

        if (!office) {
          throw new Error('Office not found')
        }

        const finaluser = await User.findOne({
          company_vat: office.company_vat
        })

        // Return user_mediahouse_id from office
        return finaluser._id
      }
      // Return req.user._id if the role is 'mediaHouse'
      return userId
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  async getAdminId(userId) {
    try {
      // Fetch user from user collection
      const user = await Admin.findById(userId)

      if (!user) {
        throw new Error('Admin not found')
      }

      // Check the role of the user
      if (user.role !== 'admin') {
        // Fetch office details if the role is not 'mediaHouse'

        // Return user_mediahouse_id from office
        return user.creator_id
      }
      // Return req.user._id if the role is 'mediaHouse'
      return userId
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  // S3 BUCKET
  async multipleuploadFilesToAwsS3Bucket(object) {
    return new Promise(async (resolve, reject) => {
      try {
        // Ensure that fileData is always an array, even if it's a single file
        const files = Array.isArray(object.fileData)
          ? object.fileData
          : [object.fileData]

        // Debug: Log the files array to inspect
        console.log('Files to upload:', files)

        // Proceed with the file upload process
        const uploadPromises = files.map(async file => {
          console.log('Uploading file:', file.name)

          const filename = Date.now() + file.name
          console.log(
            '=================---------------++++++++++++++++++++++++++=:',
            file.mimetype
          )

          const params = {
            Bucket, // Replace with your bucket name
            Key: `${object.path}/${filename}`, // Use the path from the input object
            Body: file.data, // File content (Buffer)
            ContentType: file.mimetype // MIME type (image/jpeg in this case)
          }

          // Upload the file using AWS S3 SDK
          return new Promise((innerResolve, innerReject) => {
            bucket.upload(params, (err, data) => {
              if (err) {
                console.log('Error uploading file:', err)
                innerReject(buildErrObject(422, err.message))
              } else {
                console.log('File uploaded:', data.Location)
                innerResolve({
                  media_type: file.mimetype,
                  fileName: filename,
                  data: data.Location
                })
              }
            })
          })
        })

        // Wait for all files to be uploaded
        const uploadedFiles = await Promise.all(uploadPromises)

        resolve(uploadedFiles) // Resolve with all uploaded file info
      } catch (err) {
        console.log('Error uploading files:', err)
        reject(buildErrObject(500, 'Internal Server Error'))
      }
    })
  },

  async uploadFiletoAwsS3Bucket(object) {
    return new Promise(async (resolve, reject) => {
      const file = object.fileData
      console.log('object', object)
      console.log('OBJ in upload file is here---', file.data)
      // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
      // const fileExt = fileData.pop();
      // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
      const filename = Date.now() + file.name

      const params = {
        Bucket,
        Key: `${object.path}/${filename}`,
        Body: file.data,
        ContentType: file.mimetype
      }

      return bucket.upload(params, (err, data) => {
        if (err) {
          console.log('----err----', err)
          console.log('not found', err)
          reject(buildErrObject(422, err.message))
        }
        resolve({
          media_type: file.mimetype,
          fileName: filename,
          data: data.Location
        })
      })
    })
  },

  async uploadFiletoAwsS3BucketforAdmin(object) {
    return new Promise(async (resolve, reject) => {
      // var file = object.fileData;
      console.log('OBJ in upload file is here---', object)
      // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
      // const fileExt = fileData.pop();
      // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
      const filename = object.csv
      const params = {
        Bucket,
        Key: `${object.path}/${object.csv}`,
        Body: object.buffer,
        ContentType: object.mimetype
      }

      return bucket.upload(params, (err, data) => {
        if (err) {
          console.log('----err----', err)
          reject(buildErrObject(422, err.message))
        }
        resolve({
          media_type: object.mimetype,
          fileName: filename,
          data: data.Location
        })
      })
    })
  },

  async uploadFiletoAwsS3BucketforAudiowatermark(object) {
    return new Promise(async (resolve, reject) => {
      const file = object
      console.log('OBJ in upload file is here---', file)
      const randomname = Math.floor(1000000000 + Math.random() * 9000000000)
      // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
      // const fileExt = fileData.pop();
      // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
      const filename = Date.now() + randomname
      const params = {
        Bucket,
        Key: `${`public/userImages` + '/'}${filename}`,
        Body: object.fileData,

        // ContentType: "audio/mp3",//file.mimetype ,
        ContentType: file.mime_type // file.mimetype ,
      }

      return bucket.upload(params, (err, data) => {
        if (err) {
          console.log('----err----', err)
          reject(buildErrObject(422, err.message))
        }
        resolve({ fileName: filename, data: data.Location })
      })
    })
  },

  async uploadFiletoAwsS3BucketforZip(object) {
    return new Promise(async (resolve, reject) => {
      const file = object
      console.log('OBJ in upload file is here---', file)
      const randomname = Math.floor(1000000000 + Math.random() * 9000000000)
      // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
      // const fileExt = fileData.pop();
      // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
      const filename = Date.now() + randomname
      const params = {
        Bucket,
        Key: `${object.path}/${filename}`,
        Body: object.fileData,
        ContentType: 'application/zip' // file.mimetype ,
      }

      return bucket.upload(params, (err, data) => {
        if (err) {
          console.log('----err----', err)
          reject(buildErrObject(422, err.message))
        }
        resolve({ fileName: filename, data: data.Location })
      })
    })
  },

  async uploadFiletoAwsS3BucketforVideowatermark(object) {
    return new Promise(async (resolve, reject) => {
      const file = object
      console.log('OBJ in upload file is here---', file)
      const randomname = Math.floor(1000000000 + Math.random() * 9000000000)
      // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
      // const fileExt = fileData.pop();
      // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
      const type = file.mime_type
      const splitit = type.split('/')
      const filename = `${Date.now()}${randomname}.${splitit[1]}`
      const params = {
        Bucket,
        Key: `${`public/userImages` + '/'}${filename}`,
        Body: object.fileData,
        ContentType: file.mime_type // file.mimetype ,
      }

      return bucket.upload(params, (err, data) => {
        if (err) {
          console.log('----err----', err)
          reject(buildErrObject(422, err.message))
        }
        resolve({ fileName: filename, data: data.Location })
      })
    })
  },

  async uploadFiletoAwsS3BucketforVideowatermarkwithpath(object) {
    return new Promise(async (resolve, reject) => {
      const file = object
      console.log('OBJ in upload file is here---', file)
      const randomname = Math.floor(1000000000 + Math.random() * 9000000000)
      // const [fileNamePrefix, ...fileData] = object.fileData.name.split(".");
      // const fileExt = fileData.pop();
      // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
      const type = file.mime_type
      const splitit = type.split('/')
      const filename = `${Date.now()}${randomname}.${splitit[1]}`
      const params = {
        Bucket,
        Key: `${object.path}/${filename}`,
        Body: object.fileData,
        ContentType: file.mime_type // file.mimetype ,
      }

      return bucket.upload(params, (err, data) => {
        if (err) {
          console.log('----err----', err)
          reject(buildErrObject(422, err.message))
        }
        resolve({ fileName: filename, data: data.Location })
      })
    })
  },

  async deleteImages(type, path) {
    if (typeof path === 'string') {
      path = JSON.parse(path)
    }
    if (type == 'AWS') {
      try {
        const s3 = new AWS.S3()

        for (const OldImagePath of path) {
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: OldImagePath
          }
          await s3.deleteObject(params).promise()
          return { success: true, message: 'Image deleted successfully' }
        }
      } catch (error) {
        console.error('Error deleting image: ', error)
        return { success: false, message: 'Error deleting image' }
      }
    } else {
      for (const OldImagePath of path) {
        const path = `${process.env.STORAGE_PATH_without_public}/${OldImagePath}`
        await fs.unlinkSync(path)
        return { success: true, message: 'Image deleted successfully' }
      }
    }
  },

  async deleteSingleImage(path) {
    try {
      const s3 = new AWS.S3()

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: path
      }
      await s3.deleteObject(params).promise()
      return { success: true, message: 'Image deleted successfully' }
    } catch (error) {
      console.error('Error deleting image: ', error)
      return { success: false, message: 'Error deleting image' }
    }
  },

  async deleteMediaFromS3Bucked(object) {
    return new Promise(async (resolve, reject) => {
      return bucket.deleteObject(object, (err, data) => {
        if (err) {
          console.log('----err----', err)
          reject(buildErrObject(422, err.message))
        } else {
          resolve(data)
        }
      })
    })
  },

  /**
   * capitalize first letter of string
   * @param {string} string
   */

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },

  /**
   * generate random string
   * @param {string} string
   */

  async customRandomString(
    length,
    chars = 'abcdefghijklmnopqrstuvwxyz@1234567890!'
  ) {
    let result = ''
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  },

  /**
   * generate random string
   * @param {string} string
   */

  automatedString() {
    return Math.random()
      .toString(36)
      .slice(2)
  },

  /**
   * convert a given array of string to mongoose ids
   * @param {Array} array
   */

  async convertToObjectIds(array) {
    return array.map(item => mongoose.Types.ObjectId(item))
  },

  /**
   * convert title to slug
   * @param {String} title
   */
  async createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  },

  /**
   * Validate the size
   * @param {File} file
   * @param {Number} fize size in Byte
   */
  async validateFileSize(file, size) {
    return new Promise(async (resolve, reject) => {
      try {
        if (file.size > size) {
          reject(
            buildErrObject(422, `File should be less than ${size / 1048576} MB`)
          ) // convert byte to MB
        }
        resolve({
          success: true
        })
      } catch (err) {
        reject(buildErrObject(422, err.message))
      }
    })
  }

  /**
  //  * Object to Query string
  //  * @param {Object} obj
  // */
  // async objectToQueryString(obj) {

  //   let result = querystring.stringify(obj);

  //   return result

  // }
}
