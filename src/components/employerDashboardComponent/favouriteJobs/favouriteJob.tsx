
import { worker } from "@/app/(home)/(authenticated)/dashboard/workerDashboard"

const FavouriteJob = ({user}: {user: null | worker}) => {
    console.log(user);
    return (
        <div>
            <h1>Favourite Job</h1>
        </div>
    )
}

export default FavouriteJob