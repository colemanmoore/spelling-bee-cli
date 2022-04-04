import inquirer from 'inquirer'
import { Database, SpellingBee } from '@colemanmoore/spelling-bee-core'

const db = new Database()

db.initialize().then(async () => {

    const Game = new SpellingBee(db)

    const game = await Game.createNewGame(7)
    let score = 0
    const alreadyFound = {}

    let quit = false

    async function prompt() {

        if (!quit) {

            let input = await inquirer.prompt([{
                name: 'word',
                message: formatPrompt7(game.getAllLetters().map(l => l.text), game.keyLetter)
            }])

            switch (input.word) {

                case 'q':
                    quit = true
                    break

                case '@':
                    game.shuffle()
                    break

                default:
                    if (alreadyFound[input.word]) {
                        console.log('Already found')
                        break
                    }

                    const points = game.submit(input.word)
                    if (points > 0) {
                        score += points
                        alreadyFound[input.word] = true
                        console.log(`+${points}`)
                    } else {
                        console.log('Not in word list')
                    }

                    console.log(`Your score is ${score}`)
            }

            return prompt()
        }
    }

    function formatPrompt7(letters, keyLetter) {
        return `
           ${letters[0]}
        ${letters[1]}     ${letters[2]}
           ${keyLetter}
        ${letters[3]}     ${letters[4]}
           ${letters[5]}
    ` + '\n'
    }

    prompt().then(() => {
        console.log(`
        You scored ${score} points out of
        ${game.maximumScore} possible points
        There were ${game.numberOfAnswers()} answers
        Pangram was ${game.pangrams}
    `)
        process.exit(0)
    })

})
