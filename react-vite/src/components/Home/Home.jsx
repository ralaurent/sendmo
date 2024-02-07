import React, { useEffect, useState } from 'react'
import "./Home.css"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useSelector } from 'react-redux'
import SignupFormModal from '../SignupFormModal'
import { useNavigate } from 'react-router-dom'

const Logo = () => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="104" height="20" viewBox="0 0 104 20" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M60.1163 0.112463C60.069 0.171827 59.7724 1.71303 59.458 3.53734C58.7663 7.54744 58.861 7.27527 58.3724 6.66203C57.1159 5.08442 54.7476 4.56976 52.5399 5.3944C47.6878 7.20722 46.3311 15.9308 50.5193 18.3855C52.4248 19.5022 55.0209 19.2042 56.6674 17.6801C57.2475 17.143 57.2856 17.1458 57.1736 17.7193C57.1283 17.9514 57.0678 18.2866 57.0387 18.4644L56.986 18.7876H59.2564H61.5267L62.1128 15.4486C62.4351 13.6126 62.7902 11.5867 62.9016 10.9471C63.0133 10.3073 63.164 9.45435 63.2365 9.05141C63.3088 8.64875 63.4482 7.85378 63.5459 7.28535C63.6437 6.71664 63.9662 4.87497 64.2628 3.19264C64.6296 1.11184 64.7727 0.113864 64.7105 0.0707414C64.5406 -0.0468652 60.2129 -0.00738345 60.1163 0.112463ZM5.94501 5.14043C2.86484 5.69038 1.16431 7.31559 1.26623 9.61144C1.36424 11.8194 2.5109 12.7401 6.24967 13.6123C8.56372 14.1525 8.83114 14.2986 8.83114 15.0239C8.83114 15.865 8.24058 16.2459 6.93571 16.2459C5.50875 16.2459 4.60934 15.5635 4.60934 14.4809V14.2183L2.30481 14.2412L0 14.2642L0.00840067 14.9645C0.0403225 17.5572 2.84328 19.1692 7.06452 19.0228C11.2407 18.878 13.9971 16.5936 13.4993 13.6904C13.1845 11.8541 12.1381 11.1507 8.52144 10.3428C6.3614 9.86037 5.90189 9.60724 5.90189 8.90048C5.90189 7.41136 9.42421 7.45728 9.74203 8.95032C9.88372 9.61732 9.70059 9.56832 12.0631 9.56832C14.4942 9.56832 14.3396 9.62992 14.1976 8.71707C13.7838 6.05496 10.0024 4.41603 5.94501 5.14043ZM22.229 5.12671C18.2276 5.81246 15.5482 8.8876 15.5524 12.7891C15.5563 16.6779 18.1064 19.0177 22.315 18.9942C25.7015 18.9752 28.3396 17.4709 29.51 14.8925C29.8357 14.1746 29.993 14.2211 27.2366 14.2211H24.7915L24.6755 14.5011C24.237 15.5598 22.4701 16.1988 21.3666 15.6973C20.6652 15.3786 20.2043 14.5478 20.2043 13.6022V13.1872H25.1174H30.0306L30.1093 12.98C30.4005 12.2145 30.4716 10.3974 30.2479 9.44483C29.5092 6.30053 26.0983 4.46363 22.229 5.12671ZM41.0727 5.13343C40.0442 5.3566 39.2845 5.79034 38.3988 6.65979L37.8511 7.19742L37.9119 6.85356C37.9452 6.66455 38.0203 6.24845 38.0785 5.92923C38.2129 5.19195 38.4355 5.26055 35.9117 5.26055H33.7268L33.6534 5.45433C33.6131 5.56101 33.4375 6.4817 33.2634 7.50068C33.0892 8.51938 32.8125 10.1001 32.6487 11.0135C32.1702 13.6801 31.3186 18.5999 31.3186 18.6977C31.3186 18.7576 32.101 18.7876 33.682 18.7876H36.0453L36.1352 18.335C36.1845 18.0864 36.3248 17.3012 36.4466 16.5903C37.5168 10.3484 37.551 10.2166 38.3283 9.33114C39.1185 8.43117 40.6314 8.42193 41.1326 9.31406C41.4247 9.83377 41.3774 10.7673 40.9299 13.3006C40.2279 17.2749 40.0207 18.4916 40.0207 18.64C40.0207 18.7755 40.2114 18.7876 42.377 18.7876H44.7331L44.8851 17.9044C44.9689 17.4186 45.285 15.6253 45.5882 13.9195C46.4311 9.1735 46.4742 8.29396 45.924 7.09158C45.1917 5.49269 43.1723 4.67756 41.0727 5.13343ZM73.9673 5.13427C72.9242 5.4252 72.1113 5.91383 71.2623 6.76032L70.9249 7.09662L70.9778 6.63095C71.007 6.37474 71.0571 5.96171 71.0896 5.71278L71.1481 5.26055H68.8959C67.6571 5.26055 66.6437 5.29304 66.6437 5.33252C66.6437 5.37228 66.5485 5.92475 66.4321 6.56039C66.3156 7.19602 66.1394 8.1814 66.0403 8.74983C65.8636 9.76629 65.7219 10.5758 65.1807 13.661C65.0311 14.514 64.8746 15.4058 64.8332 15.6427C64.7917 15.8796 64.659 16.6356 64.5383 17.3228C64.4176 18.01 64.3185 18.6204 64.3182 18.6798C64.3177 18.7632 64.8472 18.7876 66.6807 18.7876H69.044L69.1311 18.335C69.179 18.0864 69.3207 17.2819 69.4461 16.5474C70.0149 13.2116 70.112 12.6586 70.2775 11.8084C70.7129 9.5728 71.7546 8.41185 73.0603 8.70643C74.0426 8.92792 74.2487 9.94522 73.8026 12.3685C73.759 12.6056 73.5638 13.7106 73.3692 14.8242C73.1746 15.9378 72.9391 17.2755 72.8461 17.7966C72.7529 18.318 72.6764 18.7545 72.6758 18.7671C72.6753 18.7797 73.7503 18.7797 75.0647 18.7671L77.4546 18.7444L77.512 18.3566C77.5437 18.1435 77.7105 17.1548 77.8833 16.1596C78.0558 15.1644 78.293 13.7882 78.4097 13.101C78.7802 10.9258 78.9012 10.5008 79.3556 9.78393C80.1321 8.5583 81.624 8.27968 82.1989 9.25302C82.5369 9.82509 82.4711 10.7533 81.8458 14.2211C81.6344 15.3952 81.4837 16.2579 81.29 17.4088C81.1903 18.0013 81.0886 18.5543 81.0643 18.638C81.0223 18.7811 81.1603 18.789 83.4159 18.7674L85.8117 18.7444L86.0068 17.6244C86.1141 17.0083 86.3958 15.3994 86.633 14.0486C87.2924 10.2899 87.3408 9.94018 87.3431 8.92232C87.3456 7.85434 87.235 7.42732 86.7469 6.61807C85.4586 4.48183 81.4431 4.46391 79.3988 6.58503C78.9583 7.04229 78.8586 7.06862 78.72 6.76508C78.1278 5.46525 75.73 4.64256 73.9673 5.13427ZM96.1961 5.04158C96.1252 5.05866 95.7783 5.11971 95.4257 5.17739C88.9072 6.24173 86.5649 14.906 91.923 18.1326C93.6586 19.1776 96.5701 19.3521 98.8453 18.5467C104.867 16.4158 105.899 7.92826 100.418 5.60749C99.3731 5.16507 97.005 4.84781 96.1961 5.04158ZM24.7442 8.26232C25.4232 8.60898 25.9703 9.77189 25.7626 10.4263C25.6937 10.6436 20.7203 10.7108 20.722 10.4946C20.7234 10.305 21.1448 9.47311 21.4066 9.14241C22.1957 8.14612 23.726 7.74261 24.7442 8.26232ZM56.655 8.36229C59.2191 9.07465 58.0963 15.2392 55.3062 15.7656C53.8322 16.0437 52.9429 15.0258 52.9457 13.0638C52.9501 10.0401 54.7019 7.8199 56.655 8.36229ZM97.9095 8.44321C100.203 9.6134 98.9287 15.282 96.261 15.7751C94.3286 16.1324 93.4197 14.1177 94.1811 11.1664C94.7299 9.03825 96.517 7.73309 97.9095 8.44321Z" fill="white"/>
        </svg>
    )
}

const GitHub = () => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
            <rect y="0.810059" width="46.17" height="46.17" rx="23.085" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M21.1293 0.103625C19.6388 0.28458 19.1385 0.362621 18.162 0.56621C13.2482 1.59088 8.39456 4.63787 5.17037 8.72215C-4.74233 21.2791 0.193651 40.0589 14.8988 45.7357C17.1663 46.611 17.4332 46.3047 17.4332 42.8262V40.4581L17.1402 40.5155C16.3174 40.6769 14.2846 40.6847 13.3664 40.53C11.3527 40.1908 10.4839 39.4912 9.51256 37.4263C8.7975 35.9064 8.25932 35.1142 7.5858 34.59C7.32479 34.3869 6.96478 34.1057 6.78569 33.9652C6.06682 33.4014 6.04547 33.0282 6.72638 32.9308C8.13043 32.7294 9.63141 33.6996 10.9243 35.6439C11.9861 37.2406 12.9955 37.8435 14.5936 37.836C15.9991 37.8294 17.5234 37.4382 17.5234 37.0841C17.5234 36.4294 18.0581 35.1496 18.6148 34.4722C19.0277 33.9698 19.0805 34.0137 17.8689 33.852C11.6961 33.0287 8.51099 29.2487 8.47545 22.704C8.46183 20.2059 8.94992 18.5899 10.241 16.8578C10.7879 16.124 10.7885 16.1228 10.6839 15.7526C10.1553 13.8838 10.3033 11.0946 10.9878 10.0273C11.3933 9.39517 14.19 10.3144 16.6903 11.9017L17.3448 12.3171L18.1327 12.1226C21.3119 11.3376 24.9131 11.3376 28.0923 12.1226L28.8802 12.3171L29.5347 11.9071C32.0444 10.3346 34.7407 9.3868 35.1722 9.92542C35.88 10.8087 36.077 13.8122 35.5514 15.7082L35.4354 16.1262L35.9551 16.8134C37.4131 18.7412 37.9838 21.023 37.7254 23.8909C37.1893 29.8424 34.2169 33.0096 28.3861 33.8428C27.1374 34.0213 27.2019 33.9626 27.6434 34.5174C28.6719 35.8099 28.7918 36.5198 28.7918 41.3189C28.7918 46.4707 28.9062 46.6699 31.3262 45.7357C49.7338 38.6296 51.4341 12.4159 34.1088 2.83575C30.3878 0.778169 24.9686 -0.362496 21.1293 0.103625Z" fill="black"/>
        </svg>
    )
}

function Home(){
    const user = useSelector((store) => store.session.user);
    const navigate = useNavigate()

    const navigateToSignup = () => {
        closeMenu 
        setIsFocused(false)
    }

    const redirectToExternalSite = (url) => {
        window.location.href = url;
    }
    
    return(
        <div>
        <div className='header-container'>
            <div className='header-content'>
                <div className='header-text'>Best place to <br></br> transfer your money</div>
                <div className='sub-header-text'>Transfer any amount for free</div>
                {/* <button className='header-button'>try it out!</button> */}
                <OpenModalButton
                onButtonClick={navigateToSignup}
                modalComponent={<SignupFormModal/>}
                buttonComponent={<button className='header-button'>try it out!</button>}
                />
            </div>
            <div className='header-tabs'>
                <div className='header-tabs-text'>
                    Send & View Txs with Friends
                </div>
                <img className="header-tx-tabs top-right" src={"https://i.ibb.co/2KVtfXn/Group-8812.png"} alt=""/>
                <img className="header-tx-tabs top-left" src={"https://i.ibb.co/6rRGrsm/Group-8814.png"} alt=""/>
                <img className="header-tx-tabs bottom-left" src={"https://i.ibb.co/rdzCFRf/Group-8813.png"} alt=""/>
                <img className="header-tx-tabs bottom-right" src={"https://i.ibb.co/cXhLfgP/Group-8815.png"} alt=""/>
            </div>
        </div>
            <div className='slider-container'>
                <div className='slider'>
                    <div className='slider-text'>
                        Trusted Brands
                    </div>
                    <div className='logos'>
                        <div className='logo-slide'>
                            <img src={"https://i.ibb.co/b3XHDsG/Group-8823-1.png"}/>
                            <img src={"https://i.ibb.co/rvtLYyh/amazon-logo-1.png"}/>
                            <img src={"https://i.ibb.co/7bts7q6/IBM-logo.png"}/>
                            <img src={"https://i.ibb.co/Fm8LSDK/Zoom-Communications-Logo-1.png"}/>
                            <img src={"https://i.ibb.co/SrFZ53L/Google-G-logo-2.png"}/>
                            <img src={"https://i.ibb.co/G7fXDTf/logo-Meta-1.png"}/>
                            <img src={"https://i.ibb.co/yq9HF6C/Microsoft-logo-2012-2.png"}/>
                        </div>
                        <div className='logo-slide'>
                            <img src={"https://i.ibb.co/b3XHDsG/Group-8823-1.png"}/>
                            <img src={"https://i.ibb.co/rvtLYyh/amazon-logo-1.png"}/>
                            <img src={"https://i.ibb.co/7bts7q6/IBM-logo.png"}/>
                            <img src={"https://i.ibb.co/Fm8LSDK/Zoom-Communications-Logo-1.png"}/>
                            <img src={"https://i.ibb.co/SrFZ53L/Google-G-logo-2.png"}/>
                            <img src={"https://i.ibb.co/G7fXDTf/logo-Meta-1.png"}/>
                            <img src={"https://i.ibb.co/yq9HF6C/Microsoft-logo-2012-2.png"}/>
                        </div>
                    </div>
                </div>
            </div> 
            <footer>
                <div className='footer-content'>
                    <Logo/>
                    <div className='footer-content-text'>© Sendmo 2024</div>
                </div>
                <div onClick={() => redirectToExternalSite("https://github.com/ralaurent/sendmo")}>
                    <GitHub/>
                </div>
            </footer>
        </div>
    )
}

export default Home