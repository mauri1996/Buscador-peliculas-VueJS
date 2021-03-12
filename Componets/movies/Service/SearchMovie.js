let SearchComp = {
    template : `
        <div>
            <form @submit.prevent="searchMovie" class="form-inline md-form form-sm mt-0">
                <div class="input-group md-form form-sm form-2 pl-0 w-100">
                    <div v-show="query" class="input-group-append">                        
                        <span class="btn btn-danger" @click="reset()">
                            <i class="fas fa-times"></i>
                        </span>
                    </div>
                    <input class="form-control my-0 py-1 green border"
                        type="text"
                        placeholder="Buscar"
                        aria-label="Buscar"                        
                        v-model="query"
                        >
                    <div class="input-group-append">
                        <button class="input-group-text green">                        
                            <i class="fas fa-search text-grey"
                            aria-hidden="true">
                            </i>
                        </button>                        
                    </div>
                </div>
            </form>
        </div>        
    `,
    data (){
        return {
            inputvalue:'',
            query:'',
            page:1
        }
    },

    methods:{
        searchMovie(){
            //@submit.prevent="searchMovie"  para prevenir que siga el submit
            const URL = `${BASEURL}search/movie?query=${this.query}&api_key=${APIKEY}&language=es-MX&page=${this.page}`
            //console.log(URL)
            fetch(URL)
                .then(response => response.json())
                .then((data) => {
                    this.$emit('input',data) // emite y actuliza directamente searchMovies
                })
        },
        setPage(page){
            this.page=page
            this.searchMovie()
        },
        reset(){
            this.query=''
            this.page=1
            this.$emit('input',{})
        }
    
    }
}
