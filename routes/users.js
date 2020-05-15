const express  = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/register', (req,res)  =>{
    res.render('site/register')
})

router.post('/register', (req,res)  =>{
    User.create(req.body, (error,user) => {
        req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Kullanıcı başarılı bir şekilde oluşturuldu'
          }
        res.redirect('/users/login') //kullanıcı kayıt olunca ana sayfaya gitsin
    })
    
})

router.get('/login', (req,res)  =>{
    res.render('site/login')
})
router.post('/login', (req,res)  =>{ //bodyden email ve password aldık, bunun db dekiler ile eslesmesi lazım 
   const {email,password} = req.body

   User.findOne({email}, (error, user) => { //emaile göre kullanıcı bulundu
        if(user){ //email sistemde varsa sifre kontrol edildi
            if(user.password == password){ //girilen sifre(password) db deki password ile (user.pasword) eslesirse
                //USER SESSION
                req.session.userId = user._id  
                 //kullanıcının dbdeki id sini cookies de sessionid olarak kaydettik
                //cünkü giris yapan kullancının tekrar tekrar giris yapmasını istemiyoruz
                res.redirect('/') //email ve sifre eslesirse ana sayfaya gidilsin
            }
            else{ //pasword eslesmeşse giris sayfasına tekrar yollasın.. // burada bildirim de olusturulabilinir
                res.redirect('/users/login') 
            }
        }
        else{ // email eslesmezse kayıt sayfasına yollasın... // burada bildirim ile email yokta denilebilinir.
            res.redirect('/users/register' )
        }

   })

  
})

router.get('/logout', (req,res)  =>{ //cıkıs yapa tıklandıgında 
    req.session.destroy(() => { //cıkıs yap yani sessionu kapat
        
    res.redirect('/') // ana sayfaya yonlendırme yap
    })
})
module.exports = router