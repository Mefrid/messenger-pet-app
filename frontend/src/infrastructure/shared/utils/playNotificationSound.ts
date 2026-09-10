import notificationSound from '@/infrastructure/shared/ui/assets/notification.wav'

export const playNotificationSound = () => {
  const sound = new Audio(notificationSound)
  console.log(sound.src)

  sound.play()
}
