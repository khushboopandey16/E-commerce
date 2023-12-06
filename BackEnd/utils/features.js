

class Features{
    constructor(query,querystring)
    {
        this.query=query;
        this.querystring=querystring
    }
    search(){
        // console.log('searching test method')
        const keyword=this.querystring.keyword?{
            name:{
                $regex:this.querystring.keyword,
                options:'i'
            }
        }
        :{}
        // console.log(keyword,'search method')
        this.query=this.query.find({...keyword})
        // console.log(this.query,'query testing')
        return this
    }
    filter(){
        const copyquery={...this.querystring}
        const removefields=['keyword','page','limit'];
        removefields.forEach(key=>delete copyquery[key])
        let querystring=JSON.stringify(copyquery);
        querystring=querystring.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)
        this.query=this.query.find(JSON.parse(querystring));
        return this
    }
    pagination(itemperpage){
        const currentpage=Number(this.querystring.page)||1
        const skip=itemperpage*currentpage-1
        this.query=this.query.limit(itemperpage).skip(skip)
        return this
    }
}
module.exports=Features;