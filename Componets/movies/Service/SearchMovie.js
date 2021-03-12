let SearchComp = {
    template : `
        <div>
            <form @submit.prevent="newSearch" class="form-inline md-form form-sm mt-0">
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
            page:1,
            total_pages:1,
            infPage:1,
            supPage:10
        }
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
    },
    methods:{
        newSearch(){
            this.infPage=1
            this.page=1
            this.supPage=10
            this.searchMovie()
        },
        searchMovie(){
            //@submit.prevent="searchMovie"  para prevenir que siga el submit
            const URL = `${BASEURL}search/movie?query=${this.query}&api_key=${APIKEY}&language=es-MX&page=${this.page}`
            //console.log(URL)
            fetch(URL)
                .then(response => response.json())
                .then((data) => {   
                    if(data.total_pages < 10){
                        this.total_pages = data.total_pages            
                        this.supPage = data.total_pages
                    }else{
                        this.total_pages = data.total_pages                                                            
                    }  
                    
                    this.$emit('input',data) // emite y actuliza directamente searchMovies
                })
        },
        setPage(page){
            this.page=page
            this.$parent.page=this.page
            this.searchMovie()
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
            this.searchMovie()         
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
            this.searchMovie() 
            
        },
        reset(){
            this.query=''
            this.page=1
            this.$emit('input',{})
        }
    
    }
}
