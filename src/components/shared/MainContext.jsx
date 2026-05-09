import MainHeader from "./MainHeader.jsx";

import { RiArrowDownSLine} from "react-icons/ri";
import CatalogSection from "./ItemList/CatalogSection.jsx";

const MainContext = () => {
    return (
        <main className="lg:pl-32  pb-20 lg:pr-96">
          <div className=" md:p-8 p-4">
        {/* Header */}
          <MainHeader/>
            {/* title content */}
            <div className="flex items-center justify-between ">
           
             
            </div>
         
         
          {/* content */}        
          <CatalogSection />
          </div>
        
          
        </main>
    )
}
export default MainContext