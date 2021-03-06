import "isomorphic-fetch";
import { connect } from "react-redux";
import { Dispatches } from "../store/Actions";
import { getSectionText } from "../utils/UIHelpers";
import * as PageStatus from "../models/PageStatus";
import StoryCard from "../components/StoryCard";
import Loader from "../components/Loader";

class HomeComponent extends React.Component {
    static async getInitialProps({ req, store }) {
        const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
        const apiReq = await fetch(`${baseUrl}/api/news/top-headlines`);
        const stories = await apiReq.json();
        store.dispatch(Dispatches.UPDATE_NEWS_STORIES(stories));
    }

    render() {
        return (
            <div className="news-container">
                <h5 className="h5">
                    Trending News -&nbsp;
                    <small className="text-muted">
                        {getSectionText(this.props.sources, this.props.section)}
                    </small>
                </h5>
                <br />
                {((status) => {
                    switch (status) {
                        case PageStatus.Rendered:
                            return (
                                <div id="stories" className="row mb-2" data-columns>
                                    {this.props.stories.map(((story, index) => <StoryCard story={story} key={`${index}-${story.source.name}`} />))}
                                </div>
                            );
                        case PageStatus.Loading:
                            return <Loader />;
                        case PageStatus.Error:
                            return <h3>Error</h3>;
                        default:
                            return null;
                    }
                })(this.props.pageStatus)}
            </div>
        );
    }
}

export default connect(
    state => (state)
)(HomeComponent);