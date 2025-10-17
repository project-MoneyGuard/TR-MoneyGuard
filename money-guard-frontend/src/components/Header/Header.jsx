import css from './Header.module.css';


const Header = () => {
    return (
        <header className={css.header}>
            <div className={css.container}>
                <img src="/headerlogo.svg" alt="" className={css.logo}/>
                <div className={css.user}>
                    <span>Name</span>
                    <a href="" className={css.userExit}>                        
                        <img src="/exitlogo.svg" alt="" />
                        <span className={css.exitText}>Exit</span>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Header;