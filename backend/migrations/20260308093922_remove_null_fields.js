export const removeNull = async(db) =>{

    const updateImg =  db.collection('messages').updateMany(
            {image: null},
        {$unset: {image:""}},
    )

    const updateFile =  db.collection('messages').updateMany(
        {file: null},
        {$unset: {file: ""}}
    )

    const [finalImg,finalFile] = await Promise.all([updateFile,updateImg]);
    console.log("Promise completed with data base migration")
}