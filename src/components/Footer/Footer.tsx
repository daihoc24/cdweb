import "./footer.scss";
import logo from "../../assets/img/logo.png";
import footer from "../../assets/img/_images_icons_payment.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faPinterest,
    faSquareInstagram,
    faSquareTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <div className="footer">
            <div className="footer_content">
                <div className="footer_item">
                    <div className="icon_footer">
                        <FontAwesomeIcon className="icon" icon={faFacebook} />
                        <FontAwesomeIcon className="icon" icon={faSquareInstagram} />
                        <FontAwesomeIcon className="icon" icon={faSquareTwitter} />
                        <FontAwesomeIcon className="icon" icon={faPinterest} />
                    </div>
                </div>
                <div className="footer_item">
                    <h3>Thông tin</h3>
                    <ul>
                        <li>Về chúng tôi</li>
                        <li>Thanh toán</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>
                <div className="footer_item">
                    <h3>Tài khoản</h3>
                    <ul>
                        <li>Tài khoản</li>
                        <li>Giỏ hàng</li>
                        <li>Thực đơn</li>
                    </ul>
                </div>
                <div className="footer_item">
                    <h3>HỖ TRỢ</h3>
                    <ul>
                        <li>Giao trả hàng</li>
                        <li>Bảo mật</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
