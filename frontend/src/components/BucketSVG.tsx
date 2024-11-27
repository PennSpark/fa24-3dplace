interface BucketSVGProps {
  color: string;
}

function BucketSVG({ color }: BucketSVGProps) {
  return color !== "transparent" ? (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="scale-150"
    >
      <path
        d="M16.586 11.707C16.494 11.771 14.586 13.79 14.586 15.207C14.586 16.701 15.535 17.655 16.586 17.707C17.492 17.751 18.586 16.816 18.586 15.207C18.586 13.707 16.678 11.771 16.586 11.707ZM6.172 17.707C6.55 18.085 7.052 18.293 7.586 18.293C8.12 18.293 8.622 18.085 9 17.707L16 10.707L15.293 10L7.586 2.293L5.293 0L3.879 1.414L6.172 3.707L0.586 9.293C0.208 9.671 0 10.173 0 10.707C0 11.241 0.208 11.743 0.586 12.121L6.172 17.707ZM7.586 5.121L13.172 10.707H2L7.586 5.121Z"
        fill={color}
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="scale-150"
    >
      <path
        d="M11.4096 5.50506C13.0796 3.83502 13.9146 3 14.9522 3C15.9899 3 16.8249 3.83502 18.4949 5.50506C20.165 7.1751 21 8.01013 21 9.04776C21 10.0854 20.165 10.9204 18.4949 12.5904L14.3017 16.7837L7.21634 9.69828L11.4096 5.50506Z"
        fill="#000000"
      />
      <path
        d="M6.1557 10.759L13.2411 17.8443L12.5904 18.4949C12.2127 18.8727 11.8777 19.2077 11.5734 19.5H21C21.4142 19.5 21.75 19.8358 21.75 20.25C21.75 20.6642 21.4142 21 21 21H9C7.98423 20.9747 7.1494 20.1393 5.50506 18.4949C3.83502 16.8249 3 15.9899 3 14.9522C3 13.9146 3.83502 13.0796 5.50506 11.4096L6.1557 10.759Z"
        fill="#000000"
      />
    </svg>
  );
}

export default BucketSVG;
