let MovieDetails ={
    name:'MovieDetails',
    template: `
                <div v-if="Object.keys(movieDetails).length">
                    <div class="heroMovie text-white py-5" :style="{
                        'background':'linear-gradient(rgba(59,168,119,0.45), rgba(59,168,119,1)),url(https://image.tmdb.org/t/p/w1400_and_h450_face'+movieDetails.backdrop_path+')',
                        'background-size':'cover'
                    }">
                        <div class="container">
                            <div class="row align-items-center">
                                <div class="col-12 col-md-4 col-lg-3">
                                    <img :src="movieDetails.poster_path | completarPoster" class=" w-100"/>
                                </div>
                                <div class="col-12 col-md-8 col-lg-9">
                                    <h2>Detalles: {{movieDetails.title}}</h2>
                                    <p v-text="movieDetails.overview"></p>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>`,

    data(){
        return{
            movieDetails:{

            }
        }
    },
    methods:{
        getmovie(){
            let url= `${this.apiBaseURl}movie/${this.$route.params.id}${this.apiConfig}`            
            fetch(url)
            .then(res => res.json())
            .then(data =>{
                this.movieDetails= data
            })
            //console.log(movieDetails.backdrop_path)
        }
    },
    mounted(){    
        this.getmovie()
        
    }
    
}