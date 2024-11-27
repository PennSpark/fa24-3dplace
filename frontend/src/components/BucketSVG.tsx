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
      className="scale-[1.75]"
    >
      <path
        d="M16.586 11.707C16.494 11.771 14.586 13.79 14.586 15.207C14.586 16.701 15.535 17.655 16.586 17.707C17.492 17.751 18.586 16.816 18.586 15.207C18.586 13.707 16.678 11.771 16.586 11.707ZM6.172 17.707C6.55 18.085 7.052 18.293 7.586 18.293C8.12 18.293 8.622 18.085 9 17.707L16 10.707L15.293 10L7.586 2.293L5.293 0L3.879 1.414L6.172 3.707L0.586 9.293C0.208 9.671 0 10.173 0 10.707C0 11.241 0.208 11.743 0.586 12.121L6.172 17.707ZM7.586 5.121L13.172 10.707H2L7.586 5.121Z"
        fill={color}
      />
    </svg>
  ) : (
    <svg
      width="39"
      height="39"
      viewBox="0 0 39 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="scale-[0.9]"
    >
      <path
        d="M21 1.2501L11.1041 11.1459L1.24997 21.2293C0.473921 22.0099 0.0383301 23.066 0.0383301 24.1668C0.0383301 25.2675 0.473921 26.3236 1.24997 27.1043L10.2083 36.0626C10.5963 36.4475 11.1201 36.6645 11.6666 36.6668H36.6666V32.5001H22.0833L37.125 17.4584C37.5124 17.0715 37.8197 16.6119 38.0294 16.1061C38.2391 15.6003 38.347 15.0581 38.347 14.5105C38.347 13.963 38.2391 13.4208 38.0294 12.9149C37.8197 12.4091 37.5124 11.9496 37.125 11.5626L26.8958 1.2501C26.5088 0.862702 26.0493 0.555373 25.5435 0.345688C25.0376 0.136004 24.4954 0.0280762 23.9479 0.0280762C23.4003 0.0280762 22.8581 0.136004 22.3523 0.345688C21.8465 0.555373 21.3869 0.862702 21 1.2501ZM12.5208 32.5001L4.18747 24.1668L14.0833 14.0834L15.625 12.5209L25.9375 22.8334L16.4375 32.3334L16.2916 32.5001H12.5208Z"
        fill="black"
      />
    </svg>
  );
}

export default BucketSVG;