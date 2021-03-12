const MovieApp = Vue.component('movie-app',{
    template:` 
            <div  class="container">
                <h5>Bienvenido {{user.name}} {{user.lastname}}</h5>  
                <SearchComp ref="SearchComp" v-model="searchMovies"/>
                
                <div v-show=" !Object.keys(searchMovies).length">
                    <h2>Peliculas App</h2>
                    <div class="row">
                        <div class=" col-12 col-md-6 col-lg-4 py-2" :ref="'movie-'+item.id" v-for="(item,key) in movies">
                            <MovieComponent  
                                :id="item.id" 
                                :title="item.title" 
                                :cover="item.poster_path" 
                                :synopsis="item.overview" 
                                :key="key"
                                message="hola"
                                :like="item.like"
                                :showLike="item.showLike"
                                @changeLike="onToogleLike"                    
                            />

                        </div>
                    </div>    
                    <nav aria-label="Page navigation example">
                        <ul class="pagination justify-content-center">
                            <li class="page-item"><button class="page-link" @click="volverPage()">Previous</button></li>
                            <button @click="setPage(n)" class="btn m-1" :class="{
                                'btn-like': n != page,
                                'btn-primary': n ==page
                            }" v-for="(n,index) in countPage" :key="index" > 
                                {{n}}
                            </button>
                            <li class="page-item"><button class="page-link" @click="avanzarPage()">Next</button></li>
                        </ul>
                    </nav>
                </div>


                <div v-if="Object.keys(searchMovies).length">
                    <h2>Resultados: </h2>
                    <div class="row">
                        <div class=" col-12 col-md-6 col-lg-4 py-2" :ref="'movie-'+item.id" 
                        v-for="(item,key) in searchMovies.results"
                        v-if="item.poster_path" >
                            <MovieComponent  
                                :id="item.id" 
                                :title="item.title" 
                                :cover= "item.poster_path"
                                :synopsis="item.overview" 
                                :key="key"
                                message="hola"
                                :like="item.like"
                                :showLike="item.showLike"
                                @changeLike="onToogleLike"                    
                            />
                        </div>
                    </div>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination justify-content-center">
                            <li class="page-item"><button class="page-link" @click="$refs.SearchComp.volverPage()">Previous</button></li>
                            <button @click="$refs.SearchComp.setPage(n)" class="btn m-1" :class="{
                                'btn-like': n != $refs.SearchComp.page,
                                'btn-primary': n == $refs.SearchComp.page
                            }" v-for="(n,index) in countPage_child" :key="index" > 
                            {{n}}
                            </button>
                            <li class="page-item"><button class="page-link" @click="$refs.SearchComp.avanzarPage()">Next</button></li>
                        </ul>
                    </nav>  
                </div>                      
            </div>`
    ,
    data (){
        return{
            title: 'Props a hijos',
            movies: [
               
            ],
            showLike:false,
            user:{
                name:'mauri',
                lastname:'C'
            },
            oldUser:{
                name:'',
                lastname:''
            },
            page: 1,
            total_pages:null,
            searchMovies:{                
            },
            infPage:1,
            supPage:10,            
        }
    },   
    components:{
        MovieComponent,
        SearchComp
        
    },
    computed:{
        countPage(){
            let range=[]
            for (i = this.infPage; i<=this.supPage ;i++){
                range.push(i)
            }
            //console.log(range)
            return range
        },
        countPage_child(){
            let range=[]
            if(this.$refs.SearchComp){
                console.log(this.$refs.SearchComp)
                for (i = this.$refs.SearchComp.infPage; i<=this.$refs.SearchComp.supPage ;i++){
                    range.push(i)
                }
                //console.log(range)
            }
            
            return range
        },
    },
    methods:{
        setPage(n){

            // solucion sin metodos actualiza toda la pagina

            // solucion con metodos
            // <div class="btn-group">
            //         <button class="btn m-1" :class="{
            //             'btn-like': n != page,
            //             'btn-primary': n ==page
            //         }" v-for="(n,index) in total_pages" :key="index" @click="setPage(n)" > {{n}}</button>
            // </div>
            this.page = n
            this.getPopularMovies()
        },
        volverPage(){
            
            if(this.page === 1){
                this.page=1

            }else if(this.page === this.infPage){
                this.supPage = this.infPage-1
                this.infPage = this.infPage-10                
                this.page = this.page-1
            }else{
                this.page = this.page-1
            }
            this.getPopularMovies()
            
        },
        avanzarPage(){

            if(this.page === this.total_pages){
                this.page=this.total_pages

            }else if(this.page === this.supPage && (this.total_pages-this.supPage)>10 ){
                
                this.infPage = this.supPage+1
                this.supPage = this.supPage+10
                this.page = this.page+1
            }else if(this.page === this.supPage && (this.total_pages-this.supPage)<10 ){
                
                this.infPage = this.supPage+1
                this.supPage = this.total_pages
                this.page = this.page+1
            }else{
                this.page = this.page+1
            }
            this.getPopularMovies()
            
        },
        onToogleLike (data){
            let movieLike = this.movies.find(movie => movie.id === data.id)
            movieLike.like = data.like
            this.showLike = data.like
        },
        getPopularMovies(){
            const URL = `${BASEURL}discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&page=${this.page}`
            fetch(URL)
                .then(response => response.json())
                .then(({results,page,total_pages}) => { /// aqui agrega a movies
                    this.total_pages = total_pages
                    this.movies= results.map( m => {
                        //m.poster_path = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${m.poster_path}` // modifica el poster_path de cada pelicula para q tenga el url competo con el mixer ya no es necesario
                        m.like=false
                        return m
                    })
                })
        },        

    },
    mounted(){
        
        let locationURL = new URL(window.location.href) // trae parametro de la url
        this.page = locationURL.searchParams.get('page') || 1

        this.getPopularMovies()
    }

})


/*
   

*/