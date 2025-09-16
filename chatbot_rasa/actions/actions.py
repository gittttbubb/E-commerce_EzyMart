# actions/actions.py
from typing import Any, Text, Dict, List, Optional
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import os

# API base: trong container, để truy cập host machine (BE chạy local) thường dùng host.docker.internal (Mac/Windows)
# Nếu bạn chạy Linux và host.docker.internal không tồn tại, thay bằng IP host hoặc đặt BE chạy trên mạng nội bộ.
API_BASE = os.environ.get("API_BASE", "http://host.docker.internal:8088/api/v1")

class ActionCheckOrder(Action):
    def name(self) -> Text:
        return "action_check_order"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Lấy metadata từ message (FE sẽ gửi metadata.user_id và metadata.token)
        metadata = tracker.latest_message.get("metadata") or {}
        user_id = metadata.get("user_id") or tracker.sender_id
        token = metadata.get("token")

        if not user_id or str(user_id).lower() in ["guest", "none", "null"]:
            dispatcher.utter_message(text="Bạn chưa đăng nhập. Vui lòng đăng nhập để tra cứu đơn hàng.")
            return []

        if not token:
            dispatcher.utter_message(text="Không tìm thấy token xác thực. Vui lòng đăng nhập lại.")
            return []

        try:
            url = f"{API_BASE}/orders/user/{user_id}"
            headers = {"Authorization": f"Bearer {token}"}
            resp = requests.get(url, headers=headers, timeout=8)
            resp.raise_for_status()
            body = resp.json()
            orders = body.get("data", [])

            if not orders:
                dispatcher.utter_message(response="utter_no_orders")
                return []

            # Hiển thị tối đa 5 đơn gần nhất
            reply_lines = []
            for o in orders[:5]:
                oid = o.get("id", o.get("orderId", "N/A"))
                total = o.get("total_money", o.get("total", "N/A"))
                status = o.get("status", "N/A")
                reply_lines.append(f"• Đơn {oid} — Tổng: {total} đ — Trạng thái: {status}")

            dispatcher.utter_message(
                text="Đây là một số đơn hàng gần đây của bạn:\n" + "\n".join(reply_lines)
            )
        except requests.HTTPError as http_err:
            if resp.status_code == 401:
                dispatcher.utter_message(text="Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
            else:
                dispatcher.utter_message(text=f"Lỗi HTTP {resp.status_code}: {resp.text}")
        except Exception as e:
            dispatcher.utter_message(response="utter_error_order")

        return []
class ActionAskProducts(Action):
    def name(self) -> Text:
        return "action_ask_products"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        try:
            # gọi API products: ở đây lấy page 0, limit 5
            url = f"{API_BASE}/products?page=0&limit=10&keyword=&category_id="
            resp = requests.get(url, timeout=8)
            resp.raise_for_status()
            body = resp.json()
            data = body.get("data", {}) or {}
            products = data.get("products") or body.get("data") or []

            if not products:
                dispatcher.utter_message(response="utter_no_products")
                return []

            lines = []
            for p in products[:5]:
                name = p.get("name") or p.get("title") or "Tên SP"
                price = p.get("price") or p.get("finalPrice") or "N/A"
                pid = p.get("id") or p.get("productId") or ""
                lines.append(f"• {name} — {price} VND (id: {pid})")

            dispatcher.utter_message(text="Một số sản phẩm gợi ý:\n" + "\n".join(lines))
        except Exception as e:
            dispatcher.utter_message(text="Lỗi khi lấy danh sách sản phẩm. Vui lòng thử lại sau.")
        return []

class ActionProductDetail(Action):
    def name(self) -> Text:
        return "action_product_detail"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # đơn giản: user nói "chi tiết sản phẩm 6" -> bạn cần entity để lấy id
        text = tracker.latest_message.get("text") or ""
        # tìm số trong text
        import re
        m = re.search(r"(\d+)", text)
        if not m:
            dispatcher.utter_message(text="Bạn vui lòng cho biết ID sản phẩm.")
            return []
        pid = m.group(1)
        try:
            url = f"{API_BASE}/products/{pid}"
            resp = requests.get(url, timeout=8)
            resp.raise_for_status()
            body = resp.json()
            p = body.get("data") or body
            name = p.get("name") or p.get("title") or "Tên SP"
            price = p.get("price") or "N/A"
            desc = p.get("description") or p.get("shortDescription") or ""
            dispatcher.utter_message(text=f"{name}\nGiá: {price} VND\n{desc}")
        except Exception as e:
            dispatcher.utter_message(text="Không tìm thấy sản phẩm hoặc lỗi khi gọi API.")
        return []
