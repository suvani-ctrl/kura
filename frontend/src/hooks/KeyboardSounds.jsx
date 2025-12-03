const keywordSound = [
new Audio("/keystroke1.mp3"),
new Audio("/keystroke2.mp3"),
new Audio("/stroke3.mp3"),
new Audio("/keystroke4.mp3"),
]
function useRandomSounds() {

    const playRandomKeyStrokeSound = () =>{
        const randomSound = keywordSound[
            Math.floor(
                Math.random()
                * keywordSound.length
            )
        ]
        randomSound.currentTime = 0;
        randomSound.play().catch((error) =>{
            console.log("Sound Play error", error)
        })
    };
    return {playRandomKeyStrokeSound};
}

export default useRandomSounds