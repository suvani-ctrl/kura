const keywordSound = [
    "/keystroke1.mp3",
    "/keystroke2.mp3",
    "/keystroke3.mp3",
    "/keystroke4.mp3"
];

function useRandomSounds() {
const playRandomKeyStrokeSound  = () =>{
    const randomPath = keywordSound[
        Math.floor(Math.random() * keywordSound.length)
    ];

    const audio = new Audio(randomPath);
    audio.play().catch((error) =>{
        console.warn('Sound Play Error', error);
    });
}
    return {playRandomKeyStrokeSound};
}

export default useRandomSounds;