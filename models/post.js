const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({  //ilan tablosu ve içindeki alanların bulunduğu alan
    title:{ type:String,require:true}, //kitap ilanının başlığı olmalı ve bos geçilememeli(require)
    author:{ type: Schema.Types.ObjectId, ref:'users'},
    kitapAdi:{ type:String,require:true}, //kitap ilanının adı olmalı ve bos geçilememeli(require)
    yazarAdi:{ type:String,require:true}, //kitap ilanının yazarAdi olmalı ve bos geçilememeli(require)
    content:{ type:String,require:true}, //kitap ilanının içeriği olmalı ve bos geçilememeli(require)
    Category:{ type: Schema.Types.ObjectId, ref:'categories'}, //kitap ilanının kategorisi olmalı ve bos geçilememeli(require)
    kitapBaskiYili:{ type:String,require:true}, //kitap ilanının baskı yılı olmalı ve bos geçilememeli(require)
    kitapSehir:{ type:String,require:true}, //kitap ilanının hangiSehirde olduğu olmalı ve bos geçilememeli(require)
    kitapFiyat:{ type:String,require:true}, //kitap ilanının fiyatı olmalı ve bos geçilememeli(require)
    date: { type:Date , default: Date.now},  //kitap ilanı ne zaman olusturuldu, şuanın saatini tut
    post_image:{ type:String,require:true}
})


module.exports = mongoose.model('Post',PostSchema)