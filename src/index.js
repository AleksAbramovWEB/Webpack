// import './analytics'



import Post from "./post";

import './css/style.css'
import './css/less.less'
import './css/sass.sass'

const post = new Post('webpack post title')

$('pre').html(post.toString()+'ss')

