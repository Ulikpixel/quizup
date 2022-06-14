import { FC, useState } from "react";
import logo from "../images/logo.png";
import { Languages } from "../../../constains/languages";
import './Header.scss';
import store from "../../../stores/store";
import { classNames as cn } from "../../../utils/classNames";

const Header: FC = () => {
    const [menu, setMenu] = useState<boolean>(false);
    const languages = Object.values(Languages).filter((el: Languages) => el !== store.lang);

    return (
        <div className="header">
            <img className="header__logo" src={logo} alt="logo" />
            <div
                onClick={() => setMenu(!menu)}
                className='header__loc'
            >
                <p className="header__loc--active">{store.lang}</p>
                {menu && languages.map((el, idx) =>
                    <p
                        className={cn({
                            active: el === store.lang
                        })}
                        key={`${el}-${idx}`}
                        onClick={() => store.setLoc(el)}
                    >
                        {el}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Header;