import React, { useState } from 'react';
import NavItem from '../NavItem/NavItem';
import SubMenu from '../subMenu/SubMenu';
import css from "./style.module.scss";

const NavItems = (props) => {
  const {clickShow, showMobile} = props;
  const [nav, setNav] = useState(false);
  const showSub = (state) => {
    setNav(state);
  }
  return (
    <ul className={css.navItems}>
        <NavItem name="Trang chủ" url="/"/>
        <NavItem name="Tin tức" chil={true}  showMobile={showMobile}>
          <SubMenu >
            <NavItem name="Tin mới" url="/tin-moi-nhat/page/1"/>
            <NavItem name="Báo chí viết" url="/bao-chi-viet/page/1"/>
            <NavItem name="Phản hồi của bệnh nhân" url="/phan-hoi-ban-doc/page/1"/>
          </SubMenu>
        </NavItem>
        <NavItem name="Tư liệu" url="/thong-tin-tu-lieu/page/1"/>
        <NavItem name="Tư vấn" chil={true}  showMobile={showMobile}>
          <SubMenu >
            <NavItem name="Câu hỏi thường gặp" url="/tin moi nhat/6041a83bd76e1f0fccd69f72"/>
            <NavItem name="Tư vấn bệnh nhân" url="/thong-tin-tu-van/page/1"/>
          </SubMenu>
        </NavItem>
        <NavItem name="Giới thiệu" chil={true}  showMobile={showMobile}>
          <SubMenu>
            <NavItem name="Lương y Võ Hoàng Yên" url="/luong-y-vo-hoang-yen/6048cea7f1c9ef901ef81e7f"/>
            <NavItem name="Trung tâm Võ Hoàng Yên" url="/trung-tam-vo-hoang-yen/6048cfff92a9c4a1aab6b3dd"/>
            <NavItem name="Wikipedia về thầy Yên" url="http://vi.wikipedia.org/wiki/V%C3%B5_Ho%C3%A0ng_Y%C3%AAn"/>
          </SubMenu>
        </NavItem>
      </ul> 
  )
}

export default NavItems;