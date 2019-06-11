const $info = document.getElementById('info');

export function print(message, isError = false) {
  const $message = document.createElement('DIV');
  if (isError) {
    $message.classList.add('error-msg');
  }
  $message.textContent = message;
  $info.appendChild($message);
}

export function printError(error) {
  print(error.message, true);
}