module.exports = function Mutes(voice , text){

    new Object();
 

    this.getHumanTime = (timp) => {
        timp = timp - new Date().getTime();
        return `\`${Math.round((timp/(1000*60*60*24*30))%12)} luni\`,\`${Math.round((timp/(1000*60*60*24))%30)} zile\`,\`${Math.round((timp/(1000*60*60))%60)} ore\`,\`${Math.round((timp/(1000*60)%60))}\`minute,\`${Math.round((timp/1000)%60)}\`secunde`;

    }
}