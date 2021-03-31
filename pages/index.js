import styles from "../styles/Home.module.css";
import BaseLayout from "../components/Layouts/BaseLayout/BaseLayout";
import { useContext, useEffect, useState } from "react";
import { Cards } from "../components/Layouts/Cards";
import Card from "../components/Layouts/Cards/Card";
import BaseContent from "../components/Layouts/BaseContent";
import methodApi from "../Axios/methodApi";
import dbConnect from "../util/dbConnect";
import dbAccount from "../models/account";
import { AuthContext } from "../ContextAPI/Auth-context";

export async function getStaticProps(context) {
  dbConnect();
  const db = await dbAccount.find({}).exec();
  const kq = JSON.parse(JSON.stringify(db));
  return {
    props: { kq }, // will be passed to the page component as props
  };
}


export default function Home({ kq }) {
  const [arrTag, setArrTag] = useState([]);
  const [arrId, setArrId] = useState([]);
  const [newFeed, setNewFeed] = useState([]);
  
  const context = useContext(AuthContext);

  const fetchData = async () => {
    methodApi
      .get("/getTag/listNews")
      .then(async (res) => {
        setArrId(res.arr);
        setArrTag(res.arrTag);
      })
      .catch((err) => console.log(err));
  };

  const getNewFeed = async () => {
    methodApi.get("/getTag/newsFeed").then((res) => {
      setNewFeed(res.arr);
    });
  };
  const getEmail = async () => {
      methodApi
      .get("/auth/session")
      .then((res) => {
        if (res.user) {
          kq.map((item) => {
            if (item.email === res.user.email) {
              context.login(
                item._id,
                item.role,
                item.name,
                item.avatar
              );
            }
          });
          localStorage.removeItem("flagData");
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
    
  };

  useEffect(() => {
    getEmail();
    getNewFeed();
    fetchData();
  }, []);

  return (
    <BaseLayout title="HOME">
      <div className={styles.container}>
        <section className={styles.block}>
          <section className={styles.blockContent}>
            <div className={styles.one}>
              <Cards cls="h1_c3" loaitin="all">
                {newFeed.length > 0 &&
                  newFeed.map((item, idx) => (
                    <Card
                      cls="card_big"
                      id={item.idTag}
                      tag={item.tag}
                      key={idx}
                    ></Card>
                  ))}
              </Cards>
            </div>
            <div className={styles.two}>
              <BaseContent>
                {arrTag.length > 0 &&
                  arrTag.map((item, idx) => (
                    <Cards
                      cls="h2_c2"
                      loaitin={item.tag}
                      key={idx}
                      arr={arrId}
                    />
                  ))}
              </BaseContent>
            </div>
          </section>
        </section>
      </div>
    </BaseLayout>
  );
}
