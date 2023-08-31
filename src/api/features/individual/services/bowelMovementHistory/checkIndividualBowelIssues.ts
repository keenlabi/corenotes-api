import fetchAllBowelMovementHistory from "./fetchBowelMovementHistory"

export default function checkIndividualBowelIssues(individualId:string) {
    return new Promise<boolean>((resolve, reject)=> {
        fetchAllBowelMovementHistory(individualId)
        .then(async (foundBowelMovementHistory)=> {
            if(!foundBowelMovementHistory) resolve(false);
            
            const index = 0, indexLimit = 2;
            let absenceBowelMovementAmount = 0;

            if(index < indexLimit) {
                for await (const bowelMovement of foundBowelMovementHistory!) {
                    if(!bowelMovement.amount) absenceBowelMovementAmount++;
                }
            }

            if(absenceBowelMovementAmount === 2) resolve(true);
            resolve(false);
        })
        .catch((error)=> {
            console.log("There was an error checking individual bowel movement issues")
            reject(error)
        })
    })
}