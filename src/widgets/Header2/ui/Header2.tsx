import { useLocation, Link } from "react-router-dom";
import Tab from "widgets/Tab/Tab";
import classes from "./Header2.module.scss";
import arrow from "shared/images/Arrow.svg";
import bell from "shared/images/bell.svg";
import interrogation from "shared/images/interrogation.svg";
import block from "shared/images/block.svg";
import user_icon from "shared/images/user_icon.svg";
import { useState, useEffect } from "react";

export default function Header2() {
  const [dateTime, setDateTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  
  const pathnames = location.pathname.split("/").filter((x) => x);

  
  const filteredPathnames = pathnames.slice(1); 


  const breadcrumbLabels: { [key: string]: string } = {
    tasks: "Задачи",
    specialists: "Специалисты",
    funnel: "Воронка",
    library: "Библиотека",
    settings: "Настройки",
    overview: "Сводка",
    gantt: "Гант",
    kanban: "Канбан",
    user_projects: "Проекты",
  };

  return (
    <div className={classes.upper_block}>
      <div className={classes.left_side}>
        {filteredPathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 2).join("/")}`;
          return (
            <div key={routeTo} className={classes.breadcrumb_item}>
              {index > 0 && <img src={arrow} alt="→" className={classes.arrow_icon} />}
              <Link to={routeTo} className={classes.tab_link}>
                <Tab label={breadcrumbLabels[name] || name} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className={classes.right_side}>
        <button className={classes.create_order}>Создать заказ</button>
        <div className={classes.control_panel}>
          <button className={classes.panel_btn}>
            <img src={bell} alt="" />
          </button>
          <button className={classes.panel_btn}>
            <img src={interrogation} alt="" />
          </button>
          <button className={classes.panel_btn}>
            <img src={block} alt="" />
          </button>
          <div className={classes.time}>
            <p>{dateTime.toLocaleString()}</p>
          </div>
        </div>
        <div className={classes.profile}>
          <img src={user_icon} alt="" />
        </div>
      </div>
    </div>
  );
}
