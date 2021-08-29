// Super complicated test file
const runtest = async () => {
    console.log('Starting tests ...')
    try{
        await new Promise((resolve) => setTimeout(resolve,5000))
    }
    catch{
        console.error('Not passed')
        throw new Error('Tests failed')
    }
    console.log('Tests passed')
}

runtest()
