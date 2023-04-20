const mongoCollections = require("./config/mongoCollections")
const connection = require("./config/mongoConnections")
const bcrypt = require("bcryptjs")
const { ObjectId } = require("mongodb")

async function main() {
    console.log("Seeding database...")
    const db = await connection.dbConnection()
    await db.dropDatabase()

    
    const users = mongoCollections.users
    const userCollection = await users()

    let regina = null
    let shirley = null
    let ted = null
    let priscilla = null
    let van = null
    let becky = null

    let reginaPassword = await bcrypt.hash("REgina@123$", 10)
    let shirleyPassword = await bcrypt.hash("iLoVeCaT@36", 10)
    let tedPassword = await bcrypt.hash("IlOvEdOgS@63", 10)
    let priscillaPassword = await bcrypt.hash("iHATEBEINGHERE$685", 10)
    let vanPassword = await bcrypt.hash("Password@000", 10)
    let beckyPassword = await bcrypt.hash("NUllStory$90", 10)

    regina = {
        _id : new ObjectId(),
        firstName: "Regina",
        lastName: "Pratt",
        email: "regina.pratt12@gmail.com",
        password: reginaPassword,
        username: "itsreg1",
        source: "app"
    }
    await userCollection.insertOne(regina)

    shirley = {
        _id : new ObjectId(),
        firstName: "Shirley",
        lastName: "Farmer",
        email: "shirley.farmer@farm.com",
        password: shirleyPassword,
        username: "i_support_farmer",
        source: "app"
    }
    await userCollection.insertOne(shirley)

    ted = {
        _id : new ObjectId(),
        firstName: "Ted",
        lastName: "Mendez",
        bio: "This is my bio thank you for visiting my profile.",
        email: "ted123@teddy.com",
        password: tedPassword,
        username: "ted_the_great",
        source: "app"
    }
    await userCollection.insertOne(ted)

    priscilla = {
        _id : new ObjectId(),
        firstName: "Priscilla",
        lastName: "Roberson",
        bio: "🌎",
        email: "pricillaroberson@outlook.com",
        password: priscillaPassword,
        username: "crown_prince",
        source: "app"
    }
    await userCollection.insertOne(priscilla)
    
    van = {
        _id : new ObjectId(),
        firstName: "Van",
        lastName: "Ellis",
        bio: "😂",
        email: "vanellis@yahoo.com",
        password: vanPassword,
        username: "van_drives_truck",
        source: "app"
    }
    await userCollection.insertOne(van)

    becky = {
        _id : new ObjectId(),
        firstName: "Becky",
        lastName: "Schwartz",
        email: "beckyschwartz@gmail.com",
        password: beckyPassword,
        username: "cap_friend_123",
        source: "app"
    }
    await userCollection.insertOne(becky)


    await connection.closeConnection()
    console.log("Seeding done!")
}

main()