import Loading from '@/utils/http/loading'
import {lazy, Suspense} from 'react'
import {HashRouter,Switch,Route} from 'react-router-dom'

// 懒加载所有view组件
const Home = lazy(()=>import('@/views/home'))
const Record = lazy(()=>import('@/views/record'))
const Check = lazy(()=>import('@/views/check'))
export default function Router () {
    return <HashRouter>
        <Suspense fallback={<Loading text="加载中..."></Loading>}>
        <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/record"  component={Record}></Route>
            <Route path="/check"  component={Check}></Route>
            <Route path="*" component={Home}></Route>
        </Switch>
        </Suspense>
        
    </HashRouter>
}