import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';


export default function NewsPage(props) {

    const [news, setNews] = useState([]);
    const openTopic = id => ipcRenderer.send("fwlOpenLink", `https://forum.forgottenworld.it/t/${id}`)
    const showError = props.showError;

    useEffect(() => {
        (async () => {
            try {
                const json = await ipcRenderer.invoke("fwlFetchNews");
                setNews(json.topic_list.topics);
            } catch (err) {
                showError(err.message)
            }
        })();
    }, [setNews, showError])

    return (
        <div className="news-page">
            <div className="news-body">
                <div className="news-title">NEWS</div>
                <div className="news-rows">
                    {
                        news
                        ? news.map((r, i) =>
                            <div key={`r${i}`} className="news-item">
                                <div className="news-item-title"><span onClick={() => openTopic(r.id)}>{r.title}</span></div>
                                <span className="news-item-time">{r.created_at.split(".")[0].replace("T", " ")}</span>
                                <div className="news-item-message">{r.excerpt}</div>
                            </div>
                        )
                        : null
                    }
                </div>
            </div>
        </div>
    )
}