import { IUserDocument } from "@/models/user"
import { worker } from "@/app/(home)/(authenticated)/dashboard/workerDashboard"

const FavouriteJob = ({user}: {user: null | worker}) => {
    return (
        <div>
            <h1>Favourite Job</h1>
        </div>
    )
}

export default FavouriteJob