;; The first three lines of this file were inserted by DrScheme. They record metadata
;; about the language level of this file in a form that our tools can easily process.
#reader(lib "htdp-beginner-reader.ss" "lang")((modname location-announcer) (read-case-sensitive #t) (teachpacks ()) (htdp-settings #(#t constructor repeating-decimal #f #t none #f ())))
(require (lib "location.ss" "moby" "stub"))
(require (lib "sms.ss" "moby" "stub"))
(require (lib "world.ss" "moby" "stub"))

;; Location announcer: A program to report where we are.

(define WIDTH 320)
(define HEIGHT 480)

;; A loc is a lat/long pair representing a location.
(define-struct loc (lat long))

;; A place is centered on a location and extends 
;; to a radius measured in meters.
(define-struct place (name loc radius))

;; mile->meter: number -> number
;; Converts miles to meters.
(define (mile->meter miles)
  (* miles 1609.344))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Here are a few places of interest.
;; 100 Institute Rd, in a radius of 500 meters
(define WPI-PLACE 
  (make-place "WPI" (make-loc 42.272824 -71.808207) 500))
;; Parking place.
(define WPI-PARKING-PLACE 
  (make-place "WPI Parking" (make-loc 42.2737222 -71.8058627) 50))
;; Worcester, in a radius of 3 miles.
(define WORCESTER-PLACE 
  (make-place "Worcester" (make-loc 42.274514 -71.798744) (mile->meter 3)))

;; This is a list of the places.
(define ALL-PLACES
  (list WPI-PLACE
        WPI-PARKING-PLACE
        WORCESTER-PLACE))

;; To make this program more interesting, have this use the same
;; parser from grocery-shopper.ss so it reads the locations from
;; Google Maps.

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


;; The telephone number to send messages to.
(define ADDRESS "5554")
  
;; The world is the current location.
(define initial-world (make-loc 0 0))

;; change-location: world number number -> world
(define (change-location w lat long)
  (make-loc lat long))

;; current-place: world -> place
;; Returns the closest place.
(define (current-place w)
  (cond [(empty? (find-places ALL-PLACES w))
         (make-place "Unknown" w 0)]
        [else
         (choose-smallest
          (find-places ALL-PLACES w))]))

;; send-report: world -> world
;; Sends out a text message of the world description,
;; and produces the world.
(define (send-report w)
  (send-text-message ADDRESS 
                     (string-append (description w) 
                                    "\n" 
                                    (maps-url (place-loc (current-place w))))
                     w))

;; maps-url: loc -> string
;; Creates the Google maps url for a location.
(define (maps-url a-loc)
  (string-append "http://maps.google.com/maps?q="
                 (number->string 
                  (exact->inexact (loc-lat a-loc)))
                 ",+"
                 (number->string 
                  (exact->inexact (loc-long a-loc)))
                 "&iwloc=A&hl=en"))
  
;; description: world -> string
;; Produces a text description of the current place.
(define (description w)
  (place-name (current-place w)))


;; choose-smallest: (listof place) -> place
;; Returns the place with the smallest radius.
(define (choose-smallest places)
  (cond
    [(empty? (rest places))
     (first places)]
    [(< (place-radius (first places)) (place-radius (second places)))
     (choose-smallest (cons (first places) (rest (rest places))))]
    [else
     (choose-smallest (rest places))]))

;; find-places: world loc -> (listof place)
;; Finds places that match the a-loc.
(define (find-places places a-loc)
  (cond
    [(empty? places)
     empty]
    [(place-matches? (first places) a-loc)
     (cons (first places) (find-places (rest places) a-loc))]
    [else
     (find-places (rest places) a-loc)]))

;; place-matches?: place loc -> boolean
;; Returns true if the place matches the location.
(define (place-matches? a-place a-loc)
  (<= (location-distance (loc-lat a-loc)
                         (loc-long a-loc)
                         (loc-lat (place-loc a-place))
                         (loc-long (place-loc a-place)))
      (place-radius a-place)))


;; render: world -> world
(define (render w)
  (place-image
   (text (description w) 10 "black")
   20 
   20
   (empty-scene WIDTH HEIGHT)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define tick-delay (* 10 60))  ;; wait every ten minutes before updates.

(big-bang WIDTH HEIGHT tick-delay initial-world
          (on-tick send-report)
          (on-redraw render)
          (on-location-change change-location))
