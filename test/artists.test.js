const supertest = require('supertest')

const app = require('../src/app')
const Models = require('../src/models')

// Crea tu propios fixtures con tus artistas favoritos
const artistsFixtures = [
  {
    id: 1,
    name: 'Luis Alberto Spinetta',
    description: 'Guitarrista, Cantante y Compositor Argentino considerado como uno de los más innovadores debido a su uso de elementos del Jazz en música popular',
    code: 'L_A_SPINETTA_GUITAR',
    image: 'https://res.cloudinary.com/boolean-spa/image/upload/v1627536010/boolean-fullstack-js/L_A_SPINETTA_GUITAR_jpg_dwboej.png'
  },
  {
    id: 2,
    name: 'Chet Baker',
    description: 'Fue un trompetista, cantante y músico de jazz estadounidense. Exponente del estilo cool. Baker fue apodado popularmente como el James Dean del jazz dado a su aspecto bien parecido',
    code: 'CHET_BAKER_TRUMPET',
    image: 'https://res.cloudinary.com/boolean-spa/image/upload/v1627536010/boolean-fullstack-js/CHET_BAKER_TRUMPET_ssbyt5.jpg'
  },
  {
    id: 3,
    name: 'Tom Misch',
    description: 'Thomas Abraham Misch es un músico y productor inglés. Comenzó a lanzar música en SoundCloud en 2012 y lanzó su álbum de estudio debut Geography en 2018',
    code: 'TOM_MISCH_GUITAR',
    image: 'https://res.cloudinary.com/boolean-spa/image/upload/v1627536009/boolean-fullstack-js/TOM_MISCH_GUITAR_r456nt.jpg'
  }
]

describe('/api/artists', () => {

  // Configurar que pasara al inicio de la batería de pruebas y al finalizar

  beforeEach(async () => {
    // Creamos la base de datos vacía con las tablas necesarias
    await Models.sequelize.sync({ force: true })
  })

  afterAll(async () => {
    // En toda base de datos es importante cerrar la conexión
    await Models.sequelize.close()
  })

  it('returns an list of artists', async () => {
    await Models.Artist.bulkCreate(artistsFixtures)
    
    const response = await supertest(app)
      .get('/api/v1/artists')
      .expect(200)
    expect(response.body).toMatchObject(artistsFixtures)
  })

  it('returns 500 when the database throws error', async () => {
    // Podemos ser ingeniosos y generar un escenario que haga fallar a la base de datos
    await Models.Artist.drop()

    const response = await supertest(app)
      .get('/api/v1/artists')
      .expect(500)
    expect(response.body).toMatchObject({ message: 'SQLITE_ERROR: no such table: Artists' })
  })

  it('create artist with 201 status',async () => {
    const newArtist = {
      name: "Herbie Hancock",
      description: "Es un pianista, tecladista y compositor estadounidense de jazz. A excepción del free jazz, ha tocado prácticamente todos los estilos jazzísticos surgidos tras el bebop: hard bop, fusión, jazz modal, jazz funk, jazz electrónico, etc.",
      code: "HERBIE_HANCOCK_KEYBOARD",
      image: "https://res.cloudinary.com/boolean-spa/image/upload/v1627537633/boolean-fullstack-js/HERBIE_HANCOCK_KEYBOARD_n6b2fv.jpg"
    }

    const response = await supertest(app)
      .post('/api/v1/artists')
      .send(newArtist)
      .expect(201)
      const artist = await Models.Artist.findOne({
        where:{
          id: response.body.id
        }
      })
      expect(response.body.id).toEqual(artist.id)
  })

  it('fail on created artist with incomplete data',async () => {
    const newArtist = {
      name: "Herbie Hancock Other",
    }
    const response = await supertest(app)
      .post('/api/v1/artists')
      .send(newArtist)
      .expect(400)
      expect(response.body).toEqual({message:"Bad Request"})

  })

  it('should update Artist with status 200',async () => {
    const newArtist = {
      name: "Herbie Hancock",
      description: "Es un pianista, tecladista y compositor estadounidense de jazz. A excepción del free jazz, ha tocado prácticamente todos los estilos jazzísticos surgidos tras el bebop: hard bop, fusión, jazz modal, jazz funk, jazz electrónico, etc.",
      code: "HERBIE_HANCOCK_KEYBOARD",
      image: "https://res.cloudinary.com/boolean-spa/image/upload/v1627537633/boolean-fullstack-js/HERBIE_HANCOCK_KEYBOARD_n6b2fv.jpg"
    }
    const {dataValues: artist} = await Models.Artist.create(newArtist)

    const response = await supertest(app)
      .put(`/api/v1/artists/${artist.id}`)
      .send({code: "HERBIE_HANCOCK_KEYBOARD_AA"})
    expect(response.status).toEqual(200)

    const modifiArtist = await Models.Artist.findOne({
      where:{
        id: artist.id
      },
      raw: true
    })
    expect(modifiArtist.code).toEqual("HERBIE_HANCOCK_KEYBOARD_AA")
  })

  // it('should not update Artist when id doesnt exits',async () => {

  // })

  it('Should not destroy artist when id doesnt exists',async () => {
    const response  = await supertest(app)
      .delete('/api/v1/artists/999')
    expect(response.status).toEqual(404)
  })

  it('Should destroy Artist',async () => {
    const newArtist = {
      name: "Herbie Hancock",
      description: "Es un pianista, tecladista y compositor estadounidense de jazz. A excepción del free jazz, ha tocado prácticamente todos los estilos jazzísticos surgidos tras el bebop: hard bop, fusión, jazz modal, jazz funk, jazz electrónico, etc.",
      code: "HERBIE_HANCOCK_KEYBOARD",
      image: "https://res.cloudinary.com/boolean-spa/image/upload/v1627537633/boolean-fullstack-js/HERBIE_HANCOCK_KEYBOARD_n6b2fv.jpg"
    }
    const {dataValues: artist} = await Models.Artist.create(newArtist)

    const response  = await supertest(app)
      .delete(`/api/v1/artists/${artist.id}`)
    expect(response.status).toEqual(200)
  })

})
