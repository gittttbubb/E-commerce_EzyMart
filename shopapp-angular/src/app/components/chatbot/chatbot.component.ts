import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  animations: [
    // Hiện/ẩn toàn bộ widget
    trigger('chatAnimation', [
      state('hidden', style({ opacity: 0, transform: 'translateY(20px)', display: 'none' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)', display: 'flex' })),
      transition('hidden => visible', [
        style({ display: 'flex' }),
        animate('300ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),

    // Hiệu ứng tin nhắn user/bot
    trigger('messageAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX({{offset}})' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ], { params: { offset: '0px' } })
    ])
  ]
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatBox') private chatBox!: ElementRef;

  isOpen = false;
  messages: { sender: string, text: string }[] = [];
  userInput = '';
  isTyping = false;
  private shouldScrollToBottom = false;

  constructor(private http: HttpClient, private userService: UserService, private tokenService: TokenService) { }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.chatBox && this.chatBox.nativeElement) {
      try {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length > 0) {
      // Delay để đảm bảo animation hoàn thành trước khi scroll
      setTimeout(() => {
        this.shouldScrollToBottom = true;
      }, 350);
    }
  }
// sendMessage() {
//   if (!this.userInput.trim()) return;

//   this.messages.push({ sender: 'user', text: this.userInput });
//   this.shouldScrollToBottom = true;

//   const user = this.userService.getUserResponseFromLocalStorage();
//   const userId = user?.id || 'guest';   // user.id là field đã lưu ở localStorage

//   const payload = {
//     sender: userId.toString(),          // có thể dùng luôn userId làm sender
//     message: this.userInput,
//     metadata: { user_id: userId }       // ✅ gửi userId trong metadata
//   };

//   this.userInput = '';
//   this.isTyping = true;

//   this.http.post<any[]>('http://localhost:5005/webhooks/rest/webhook', payload)
//     .subscribe({
//       next: (res) => {
//         this.isTyping = false;
//         res.forEach(msg => {
//           if (msg.text) this.messages.push({ sender: 'bot', text: msg.text });
//         });
//         this.shouldScrollToBottom = true;
//       },
//       error: () => {
//         this.isTyping = false;
//         this.messages.push({ sender: 'bot', text: '⚠️ Lỗi kết nối server.' });
//         this.shouldScrollToBottom = true;
//       }
//     });
// }

sendMessage() {
  if (!this.userInput.trim()) return;

  this.messages.push({ sender: 'user', text: this.userInput });
  this.shouldScrollToBottom = true;

  // Lấy userId và token từ TokenService
  const userId = this.tokenService.getUserId() || 'guest';
  const token = this.tokenService.getToken();

  const payload = {
    sender: 'user1',
    message: this.userInput,
    metadata: {
      user_id: userId,
      token: token
    }
  };

  this.userInput = '';
  this.isTyping = true;

  this.http.post<any[]>('http://localhost:5005/webhooks/rest/webhook', payload)
    .subscribe({
      next: (res) => {
        this.isTyping = false;
        res.forEach(msg => {
          if (msg.text) this.messages.push({ sender: 'bot', text: msg.text });
        });
        this.shouldScrollToBottom = true;
      },
      error: () => {
        this.isTyping = false;
        this.messages.push({ sender: 'bot', text: '⚠️ Lỗi kết nối server.' });
        this.shouldScrollToBottom = true;
      }
    });
}

}