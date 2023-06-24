export default function capitalize(sentence:string):string {
    const wordList:Array<string> = sentence.split(' ').map(word => `${word.substring(0, 1).toUpperCase() + word.substring(1, word.length)}`);
    return wordList.join(' ');
}