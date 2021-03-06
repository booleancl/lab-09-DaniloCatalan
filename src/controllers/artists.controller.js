const Models = require('../models')
const Artist = Models.Artist

module.exports = {
  getAllArtists: async (request, response) => {
    let statusCode = 200

    try {
      const artists = await Artist.findAll()
  
      console.log(`GET with status code ${statusCode} in /api/v1/artist endpoint`)
  
      response
        .status(statusCode)
        .json(artists)
  
    } catch (error) {
      const { message } = error
      statusCode = 500
  
      console.error(`GET with status code ${statusCode} in /api/v1/artist endpoint. Error: ${message}`)
      
      response
        .status(statusCode)
        .json({ message })
    }
  },
  saveArtist: async (request, response) => {
    let statusCode = 201
  
    try {
      const  {name, description, code ,image } = request.body
      const hasValues = (name && description && code && image)

      if (!hasValues) {
        return response
          .status(400)
          .json({ message:"Bad Request" })
      }
      const artistData = {
        ...request.body
      }
      const artist = await Artist.create(artistData)
  
      console.log(`POST with status code ${statusCode} in /api/v1/artist endpoint`)
  
      response
        .status(statusCode)
        .json(artist)
  
    } catch (error) {
      const { message } = error
      statusCode = 500

      console.error(`GET with status code ${statusCode} in /api/v1/artist endpoint. Error: ${message}`)
      
      response
        .status(statusCode)
        .json({ message })
    }
  },
  updateArtist: async (request, response) => {
    let statusCode = 200
    const { params } = request
  
    try {
      const artist = await Artist.findOne({
        where: {
          id: params.id
        }
      })

      if (artist === null) {
        throw new Error(`Artist with id ${params.id} not found`)
      }

      const artistData = {
        ...request.body
      }
      const artistUpdated = await Artist.update(artistData, {
        where: {
          id: artist.id
        }
      })
  
      console.log(`PUT with status code ${statusCode} in /api/v1/artist endpoint`)
  
      response
        .status(statusCode)
        .json(artistUpdated)
  
    } catch (error) {
      const { message } = error
      statusCode = 500

      console.error(`GET with status code ${statusCode} in /api/v1/artist endpoint. Error: ${message}`)
      
      response
        .status(statusCode)
        .json({ message })
    }
  },
  removeArtist: async (request, response) => {
    let statusCode = 200
    const { params } = request

    try {
      const artist = await Artist.findOne({
        where: {
          id: params.id
        }
      })

      if (artist === null) {
        //throw new Error(`Artist with id ${params.id} not found`)
        return response.status(404).json({ message : `Artist with id ${params.id} not foound`})
      }

      await Artist.destroy({
        where: {
          id: artist.id
        }
      })
  
      console.log(`DELETE with status code ${statusCode} in /api/v1/artist/${params.id} endpoint`)
  
      response
        .status(statusCode)
        .send() //<-- error! esto provoca que se cuelgue el servidor. Debemos usar send() o json() para cortar la conexi??n.

        /*
          ??Qu?? nivel de pruebas es el indicado para NUNCA M??S COMETER ESTE ERROR?
            - Integraci??n
            - Unitarias
            - End-to-End (e2e)
        */
    } catch (error) {
      const { message } = error
      statusCode = 500

      console.error(`GET with status code ${statusCode} in /api/v1/artists/${params.id} endpoint. Error: ${message}`)
      
      response
        .status(statusCode)
        .json({ message })
    }
  }
}
